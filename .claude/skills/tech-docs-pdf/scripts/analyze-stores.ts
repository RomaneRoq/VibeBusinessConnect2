#!/usr/bin/env npx ts-node

/**
 * analyze-stores.ts
 *
 * Analyzes Zustand store files and extracts state and actions documentation.
 *
 * Usage:
 *   npx ts-node analyze-stores.ts <directory-path> [--output <json-path>]
 */

import * as fs from 'fs';
import * as path from 'path';

interface StoreInfo {
  name: string;
  filePath: string;
  relativePath: string;
  state: StateProperty[];
  actions: ActionInfo[];
  persistence: PersistenceInfo | null;
  description: string;
}

interface StateProperty {
  name: string;
  type: string;
  description?: string;
  initialValue?: string;
}

interface ActionInfo {
  name: string;
  parameters: string;
  description?: string;
}

interface PersistenceInfo {
  name: string;
  storage: string;
}

function extractStoreName(content: string, fileName: string): string {
  const patterns = [
    /export\s+const\s+use(\w+)Store/,
    /const\s+use(\w+)Store/,
    /create<(\w+)State>/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return fileName.replace(/Store\.ts$/, '').replace(/\.ts$/, '');
}

function extractStateInterface(content: string): StateProperty[] {
  const state: StateProperty[] = [];

  const statePattern = /interface\s+\w*State\s*\{([^}]+)\}/s;
  const match = content.match(statePattern);

  if (match) {
    const body = match[1];
    const lines = body.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) continue;

      const propMatch = trimmed.match(/^(\w+)(\?)?:\s*(.+?);?\s*$/);

      if (propMatch) {
        if (propMatch[3].includes('=>') || propMatch[3].startsWith('(')) {
          continue;
        }

        state.push({
          name: propMatch[1],
          type: propMatch[3].replace(/;$/, '').trim(),
        });
      }
    }
  }

  return state;
}

function extractActions(content: string): ActionInfo[] {
  const actions: ActionInfo[] = [];

  const arrowFunctionPattern = /(\w+):\s*\(([^)]*)\)\s*=>/g;
  let match;

  while ((match = arrowFunctionPattern.exec(content)) !== null) {
    const name = match[1];
    const params = match[2].trim();

    if (name === 'set' || name === 'get') continue;

    actions.push({
      name,
      parameters: params || 'void',
    });
  }

  const asyncPattern = /(\w+):\s*\(([^)]*)\)\s*=>\s*Promise/g;

  while ((match = asyncPattern.exec(content)) !== null) {
    const name = match[1];
    const params = match[2].trim();

    if (!actions.find((a) => a.name === name)) {
      actions.push({
        name,
        parameters: params || 'void',
      });
    }
  }

  return actions;
}

function extractPersistence(content: string): PersistenceInfo | null {
  const persistPattern = /persist\s*\([^,]+,\s*\{\s*name:\s*['"]([^'"]+)['"]/;
  const match = content.match(persistPattern);

  if (match) {
    const storageMatch = content.match(/storage:\s*(\w+)/);
    return {
      name: match[1],
      storage: storageMatch ? storageMatch[1] : 'localStorage',
    };
  }

  return null;
}

function extractDescription(content: string): string {
  const jsdocMatch = content.match(/^\/\*\*([^*]|\*(?!\/))*\*\//);

  if (jsdocMatch) {
    const descMatch = jsdocMatch[0].match(/\*\s*(.+?)(?:\n|\*\/)/);
    if (descMatch) {
      return descMatch[1].trim();
    }
  }

  return '';
}

function analyzeStoreFile(filePath: string, basePath: string): StoreInfo | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);

    if (!fileName.includes('Store') && !fileName.includes('store')) {
      if (!content.includes('create') || !content.includes('zustand')) {
        return null;
      }
    }

    const storeName = extractStoreName(content, fileName);
    const state = extractStateInterface(content);
    const actions = extractActions(content);
    const persistence = extractPersistence(content);
    const description = extractDescription(content);

    return {
      name: storeName,
      filePath,
      relativePath: path.relative(basePath, filePath),
      state,
      actions,
      persistence,
      description: description || `Store de gestion pour ${storeName}`,
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error);
    return null;
  }
}

function walkDirectory(dir: string, basePath: string): StoreInfo[] {
  const stores: StoreInfo[] = [];

  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        stores.push(...walkDirectory(filePath, basePath));
      } else if (/\.ts$/.test(file) && !file.includes('.test.')) {
        const store = analyzeStoreFile(filePath, basePath);
        if (store) {
          stores.push(store);
        }
      }
    }
  } catch (error) {
    console.error(`Error walking directory ${dir}:`, error);
  }

  return stores;
}

function analyzeStoresDirectory(dirPath: string): StoreInfo[] {
  const absolutePath = path.resolve(dirPath);
  return walkDirectory(absolutePath, absolutePath);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: analyze-stores.ts <directory-path> [--output <json-path>]');
    process.exit(1);
  }

  const dirPath = args[0];
  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;

  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    process.exit(1);
  }

  console.log(`Analyzing stores in: ${dirPath}`);
  const stores = analyzeStoresDirectory(dirPath);
  console.log(`Found ${stores.length} stores`);

  const result = {
    total: stores.length,
    stores,
    withPersistence: stores.filter((s) => s.persistence !== null).length,
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
