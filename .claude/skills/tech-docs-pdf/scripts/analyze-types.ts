#!/usr/bin/env npx ts-node

/**
 * analyze-types.ts
 *
 * Analyzes TypeScript type definition files and extracts:
 * - Interfaces
 * - Type aliases
 * - Enums
 * - Constants
 *
 * Usage:
 *   npx ts-node analyze-types.ts <path> [--output <json-path>]
 */

import * as fs from 'fs';
import * as path from 'path';

interface TypeInfo {
  name: string;
  kind: 'interface' | 'type' | 'enum' | 'const';
  properties: PropertyInfo[];
  filePath: string;
  relativePath: string;
  exported: boolean;
  description?: string;
  rawDefinition: string;
}

interface PropertyInfo {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
}

function extractJSDocComment(content: string, position: number): string | undefined {
  const before = content.slice(0, position);
  const jsdocMatch = before.match(/\/\*\*([^*]|\*(?!\/))*\*\/\s*$/);

  if (jsdocMatch) {
    const comment = jsdocMatch[0];
    const descMatch = comment.match(/\/\*\*\s*\n?\s*\*?\s*(.+?)(?:\n|\s*\*\/)/);
    if (descMatch) {
      return descMatch[1].trim();
    }
  }
  return undefined;
}

function parseInterfaceProperties(content: string): PropertyInfo[] {
  const properties: PropertyInfo[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
      continue;
    }

    const propMatch = line.match(/^(\w+)(\?)?:\s*(.+?);?\s*$/);

    if (propMatch) {
      let description: string | undefined;
      if (i > 0) {
        const prevLine = lines[i - 1].trim();
        const commentMatch = prevLine.match(/\/\/\s*(.+)/) || prevLine.match(/\*\s*(.+)/);
        if (commentMatch) {
          description = commentMatch[1].trim();
        }
      }

      properties.push({
        name: propMatch[1],
        type: propMatch[3].replace(/;$/, '').trim(),
        optional: !!propMatch[2],
        description,
      });
    }
  }

  return properties;
}

function parseUnionType(typeContent: string): PropertyInfo[] {
  const options = typeContent.split('|').map((s) => s.trim());
  return options.map((option, index) => ({
    name: `value_${index + 1}`,
    type: option,
    optional: false,
  }));
}

function parseEnumMembers(content: string): PropertyInfo[] {
  const properties: PropertyInfo[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    const enumMatch = trimmed.match(/^(\w+)(?:\s*=\s*(.+?))?[,}]?\s*$/);

    if (enumMatch && enumMatch[1]) {
      properties.push({
        name: enumMatch[1],
        type: enumMatch[2] ? enumMatch[2].trim() : 'auto',
        optional: false,
      });
    }
  }

  return properties;
}

function parseConstObject(content: string): PropertyInfo[] {
  const properties: PropertyInfo[] = [];
  const pairRegex = /(\w+):\s*(['"`][^'"`]+['"`]|[^,}\n]+)/g;
  let match;

  while ((match = pairRegex.exec(content)) !== null) {
    properties.push({
      name: match[1],
      type: match[2].trim(),
      optional: false,
    });
  }

  return properties;
}

function analyzeTypeFile(filePath: string, basePath: string): TypeInfo[] {
  const types: TypeInfo[] = [];

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(basePath, filePath);

    // Extract interfaces
    const interfaceRegex = /(export\s+)?interface\s+(\w+)(?:\s+extends\s+\w+)?\s*\{([^}]+)\}/g;
    let match;

    while ((match = interfaceRegex.exec(content)) !== null) {
      const isExported = !!match[1];
      const name = match[2];
      const body = match[3];
      const description = extractJSDocComment(content, match.index);

      types.push({
        name,
        kind: 'interface',
        properties: parseInterfaceProperties(body),
        filePath,
        relativePath,
        exported: isExported,
        description,
        rawDefinition: match[0],
      });
    }

    // Extract type aliases
    const typeRegex = /(export\s+)?type\s+(\w+)\s*=\s*([^;]+);/g;

    while ((match = typeRegex.exec(content)) !== null) {
      const isExported = !!match[1];
      const name = match[2];
      const typeContent = match[3].trim();
      const description = extractJSDocComment(content, match.index);

      let properties: PropertyInfo[];

      if (typeContent.startsWith('{')) {
        properties = parseInterfaceProperties(typeContent.slice(1, -1));
      } else if (typeContent.includes('|')) {
        properties = parseUnionType(typeContent);
      } else {
        properties = [{ name: 'value', type: typeContent, optional: false }];
      }

      types.push({
        name,
        kind: 'type',
        properties,
        filePath,
        relativePath,
        exported: isExported,
        description,
        rawDefinition: match[0],
      });
    }

    // Extract enums
    const enumRegex = /(export\s+)?enum\s+(\w+)\s*\{([^}]+)\}/g;

    while ((match = enumRegex.exec(content)) !== null) {
      const isExported = !!match[1];
      const name = match[2];
      const body = match[3];
      const description = extractJSDocComment(content, match.index);

      types.push({
        name,
        kind: 'enum',
        properties: parseEnumMembers(body),
        filePath,
        relativePath,
        exported: isExported,
        description,
        rawDefinition: match[0],
      });
    }

    // Extract const objects
    const constRegex = /(export\s+)?const\s+(\w+)(?::\s*\w+)?\s*=\s*\{([^}]+)\}/g;

    while ((match = constRegex.exec(content)) !== null) {
      const isExported = !!match[1];
      const name = match[2];
      const body = match[3];
      const description = extractJSDocComment(content, match.index);

      if (name.includes('LABEL') || name.includes('CONFIG') || name.toUpperCase() === name) {
        types.push({
          name,
          kind: 'const',
          properties: parseConstObject(body),
          filePath,
          relativePath,
          exported: isExported,
          description,
          rawDefinition: match[0],
        });
      }
    }
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error);
  }

  return types;
}

function walkDirectory(dir: string, basePath: string): TypeInfo[] {
  const types: TypeInfo[] = [];

  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        types.push(...walkDirectory(filePath, basePath));
      } else if (/\.ts$/.test(file) && !file.endsWith('.d.ts') && !file.includes('.test.')) {
        types.push(...analyzeTypeFile(filePath, basePath));
      }
    }
  } catch (error) {
    console.error(`Error walking directory ${dir}:`, error);
  }

  return types;
}

function analyzeTypesDirectory(targetPath: string): TypeInfo[] {
  const absolutePath = path.resolve(targetPath);

  if (fs.statSync(absolutePath).isDirectory()) {
    return walkDirectory(absolutePath, absolutePath);
  } else {
    return analyzeTypeFile(absolutePath, path.dirname(absolutePath));
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: analyze-types.ts <path> [--output <json-path>]');
    process.exit(1);
  }

  const targetPath = args[0];
  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;

  if (!fs.existsSync(targetPath)) {
    console.error(`Path not found: ${targetPath}`);
    process.exit(1);
  }

  console.log(`Analyzing types in: ${targetPath}`);
  const types = analyzeTypesDirectory(targetPath);
  console.log(`Found ${types.length} type definitions`);

  const grouped = {
    interfaces: types.filter((t) => t.kind === 'interface'),
    types: types.filter((t) => t.kind === 'type'),
    enums: types.filter((t) => t.kind === 'enum'),
    constants: types.filter((t) => t.kind === 'const'),
  };

  const result = {
    total: types.length,
    grouped,
    types,
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
