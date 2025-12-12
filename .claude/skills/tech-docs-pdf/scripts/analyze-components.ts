#!/usr/bin/env npx ts-node

/**
 * analyze-components.ts
 *
 * Analyzes React component files and extracts documentation information.
 * Parses props interfaces, JSDoc comments, and component structure.
 *
 * Usage:
 *   npx ts-node analyze-components.ts <directory-path> [--output <json-path>]
 */

import * as fs from 'fs';
import * as path from 'path';

interface ComponentInfo {
  name: string;
  filePath: string;
  relativePath: string;
  props: PropInfo[];
  imports: ImportInfo[];
  hooks: string[];
  description: string;
  category: 'ui' | 'shared' | 'layout' | 'page' | 'other';
}

interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

interface ImportInfo {
  module: string;
  named: string[];
  defaultImport?: string;
}

function extractPropsFromInterface(content: string, componentName: string): PropInfo[] {
  const props: PropInfo[] = [];

  const propsPatterns = [
    new RegExp(`interface\\s+${componentName}Props\\s*\\{([^}]+)\\}`, 's'),
    new RegExp(`interface\\s+Props\\s*\\{([^}]+)\\}`, 's'),
    new RegExp(`type\\s+${componentName}Props\\s*=\\s*\\{([^}]+)\\}`, 's'),
  ];

  for (const pattern of propsPatterns) {
    const match = content.match(pattern);
    if (match) {
      const propsContent = match[1];
      const propLines = propsContent.split('\n').filter((line) => line.trim());

      for (const line of propLines) {
        const propMatch = line.match(/^\s*\/\*\*?\s*(.*?)\s*\*\/\s*(\w+)(\?)?:\s*(.+?);?\s*$/);
        const simpleMatch = line.match(/^\s*(\w+)(\?)?:\s*(.+?);?\s*$/);

        if (propMatch) {
          props.push({
            name: propMatch[2],
            type: propMatch[4].trim().replace(/;$/, ''),
            required: !propMatch[3],
            description: propMatch[1].trim(),
          });
        } else if (simpleMatch) {
          props.push({
            name: simpleMatch[1],
            type: simpleMatch[3].trim().replace(/;$/, ''),
            required: !simpleMatch[2],
          });
        }
      }
      break;
    }
  }

  return props;
}

function extractImports(content: string): ImportInfo[] {
  const imports: ImportInfo[] = [];
  const importRegex = /import\s+(?:(\w+)\s*,?\s*)?(?:\{([^}]+)\})?\s*from\s*['"]([^'"]+)['"]/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const defaultImp = match[1];
    const namedImports = match[2]
      ? match[2]
          .split(',')
          .map((s) => s.trim().split(' as ')[0].trim())
          .filter(Boolean)
      : [];
    const modulePath = match[3];

    imports.push({
      module: modulePath,
      named: namedImports,
      defaultImport: defaultImp,
    });
  }

  return imports;
}

function extractHooks(content: string): string[] {
  const hooks: string[] = [];
  const hookRegex = /\buse[A-Z]\w+/g;

  let match;
  while ((match = hookRegex.exec(content)) !== null) {
    if (!hooks.includes(match[0])) {
      hooks.push(match[0]);
    }
  }

  return hooks;
}

function extractJSDocDescription(content: string, componentName: string): string {
  const jsdocPattern = new RegExp(
    `/\\*\\*[\\s\\S]*?\\*/\\s*(?:export\\s+)?(?:default\\s+)?(?:function|const)\\s+${componentName}`,
    'i'
  );
  const match = content.match(jsdocPattern);

  if (match) {
    const jsdoc = match[0];
    const descMatch = jsdoc.match(/\/\*\*\s*\n?\s*\*?\s*(.+?)(?:\n|\*\/)/);
    if (descMatch) {
      return descMatch[1].trim();
    }
  }

  return '';
}

function determineCategory(filePath: string): ComponentInfo['category'] {
  if (filePath.includes('/ui/')) return 'ui';
  if (filePath.includes('/shared/')) return 'shared';
  if (filePath.includes('/layout/') || filePath.includes('/layouts/')) return 'layout';
  if (filePath.includes('/pages/')) return 'page';
  return 'other';
}

function extractComponentName(content: string, fileName: string): string {
  const patterns = [
    /export\s+default\s+function\s+(\w+)/,
    /export\s+function\s+(\w+)/,
    /export\s+const\s+(\w+)\s*[:=]/,
    /function\s+(\w+)\s*\(/,
    /const\s+(\w+)\s*[:=]\s*(?:\([^)]*\)|[^=])*=>\s*[({]/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return fileName.replace(/\.(tsx?|jsx?)$/, '');
}

function analyzeComponentFile(filePath: string, basePath: string): ComponentInfo | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);

    if (fileName.startsWith('index.') || fileName.includes('.test.') || fileName.includes('.spec.')) {
      return null;
    }

    const componentName = extractComponentName(content, fileName);
    const props = extractPropsFromInterface(content, componentName);
    const imports = extractImports(content);
    const hooks = extractHooks(content);
    const description = extractJSDocDescription(content, componentName);
    const relativePath = path.relative(basePath, filePath);

    return {
      name: componentName,
      filePath: filePath,
      relativePath: relativePath,
      props,
      imports,
      hooks,
      description: description || `Composant ${componentName}`,
      category: determineCategory(filePath),
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error);
    return null;
  }
}

function walkDirectory(dir: string, basePath: string): ComponentInfo[] {
  const components: ComponentInfo[] = [];

  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        components.push(...walkDirectory(filePath, basePath));
      } else if (/\.(tsx|jsx)$/.test(file) && !file.includes('.test.') && !file.includes('.spec.')) {
        const component = analyzeComponentFile(filePath, basePath);
        if (component) {
          components.push(component);
        }
      }
    }
  } catch (error) {
    console.error(`Error walking directory ${dir}:`, error);
  }

  return components;
}

function analyzeDirectory(dirPath: string): ComponentInfo[] {
  const absolutePath = path.resolve(dirPath);
  return walkDirectory(absolutePath, absolutePath);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: analyze-components.ts <directory-path> [--output <json-path>]');
    process.exit(1);
  }

  const dirPath = args[0];
  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;

  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    process.exit(1);
  }

  console.log(`Analyzing components in: ${dirPath}`);
  const components = analyzeDirectory(dirPath);
  console.log(`Found ${components.length} components`);

  const grouped = {
    ui: components.filter((c) => c.category === 'ui'),
    shared: components.filter((c) => c.category === 'shared'),
    layout: components.filter((c) => c.category === 'layout'),
    page: components.filter((c) => c.category === 'page'),
    other: components.filter((c) => c.category === 'other'),
  };

  const result = {
    total: components.length,
    grouped,
    components,
  };

  const jsonOutput = JSON.stringify(result, null, 2);

  if (outputPath) {
    fs.writeFileSync(outputPath, jsonOutput);
    console.log(`Analysis written to: ${outputPath}`);
  } else {
    console.log(jsonOutput);
  }
}

main();
