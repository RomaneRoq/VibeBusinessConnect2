#!/usr/bin/env npx ts-node

/**
 * generate-html.ts
 *
 * Generates professional HTML documentation that can be printed to PDF via browser.
 * Alternative when Puppeteer browser dependencies are not available.
 *
 * Usage:
 *   npx ts-node generate-html.ts --project <path> --output <path> [--type all|components|types|architecture|developer]
 *
 * Then open the HTML file in a browser and print to PDF (Ctrl+P / Cmd+P)
 */

import * as fs from 'fs';
import * as path from 'path';

interface GenerateHTMLOptions {
  type: 'components' | 'architecture' | 'developer' | 'types' | 'all';
  projectPath: string;
  outputPath: string;
  language: 'fr' | 'en';
  projectName: string;
}

interface ComponentInfo {
  name: string;
  relativePath: string;
  props: { name: string; type: string; required: boolean }[];
  hooks: string[];
  category: 'ui' | 'shared' | 'layout' | 'page' | 'other';
}

interface TypeInfo {
  name: string;
  kind: 'interface' | 'type' | 'const';
  properties: { name: string; type: string; optional: boolean }[];
}

interface StoreInfo {
  name: string;
  relativePath: string;
  state: { name: string; type: string }[];
  actions: { name: string; parameters: string }[];
  persistence: { name: string } | null;
}

const LABELS = {
  tableOfContents: 'Table des matieres',
  components: 'Composants',
  architecture: 'Architecture',
  types: 'Types et Interfaces',
  props: 'Proprietes',
  generatedOn: 'Genere le',
  overview: 'Vue d\'ensemble',
  stateManagement: 'Gestion d\'etat',
  conventions: 'Conventions',
  setup: 'Installation',
  developerGuide: 'Guide du developpeur',
  required: 'Requis',
  optional: 'Optionnel',
  actions: 'Actions',
  state: 'Etat',
  uiComponents: 'Composants UI',
  sharedComponents: 'Composants Partages',
  layoutComponents: 'Composants Layout',
  pageComponents: 'Pages',
  hooks: 'Hooks utilises',
  noProps: 'Aucune propriete',
  interfaces: 'Interfaces',
  typeAliases: 'Types',
  constants: 'Constantes',
  persistence: 'Persistance',
  techStack: 'Stack Technique',
  directoryStructure: 'Structure des Dossiers',
  printToPdf: 'Pour imprimer en PDF: Ctrl+P (Windows/Linux) ou Cmd+P (Mac)',
};

function analyzeComponents(projectPath: string): ComponentInfo[] {
  const components: ComponentInfo[] = [];
  const componentsDir = path.join(projectPath, 'components');
  const pagesDir = path.join(projectPath, 'pages');

  function walkDir(dir: string, category: ComponentInfo['category']) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        let subCategory = category;
        if (file === 'ui') subCategory = 'ui';
        else if (file === 'shared') subCategory = 'shared';
        else if (file === 'layout') subCategory = 'layout';
        walkDir(filePath, subCategory);
      } else if (file.endsWith('.tsx') && !file.includes('.test.')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const componentName = file.replace('.tsx', '');
        const props: { name: string; type: string; required: boolean }[] = [];
        const propsMatch = content.match(/interface\s+\w*Props\s*\{([^}]+)\}/s);
        if (propsMatch) {
          const propLines = propsMatch[1].split('\n');
          for (const line of propLines) {
            const propMatch = line.trim().match(/^(\w+)(\?)?:\s*(.+?);?\s*$/);
            if (propMatch) {
              props.push({
                name: propMatch[1],
                type: propMatch[3].replace(/;$/, ''),
                required: !propMatch[2],
              });
            }
          }
        }
        const hooks: string[] = [];
        const hookMatches = content.match(/use[A-Z]\w+/g);
        if (hookMatches) {
          hookMatches.forEach(h => { if (!hooks.includes(h)) hooks.push(h); });
        }
        components.push({
          name: componentName,
          relativePath: path.relative(projectPath, filePath),
          props,
          hooks,
          category,
        });
      }
    }
  }
  walkDir(componentsDir, 'other');
  walkDir(pagesDir, 'page');
  return components;
}

function analyzeTypes(projectPath: string): TypeInfo[] {
  const types: TypeInfo[] = [];
  const typesFile = path.join(projectPath, 'types', 'index.ts');
  if (!fs.existsSync(typesFile)) return types;
  const content = fs.readFileSync(typesFile, 'utf-8');

  const interfaceRegex = /export\s+interface\s+(\w+)\s*\{([^}]+)\}/g;
  let match;
  while ((match = interfaceRegex.exec(content)) !== null) {
    const properties: { name: string; type: string; optional: boolean }[] = [];
    const lines = match[2].split('\n');
    for (const line of lines) {
      const propMatch = line.trim().match(/^(\w+)(\?)?:\s*(.+?);?\s*$/);
      if (propMatch) {
        properties.push({
          name: propMatch[1],
          type: propMatch[3].replace(/;$/, ''),
          optional: !!propMatch[2],
        });
      }
    }
    types.push({ name: match[1], kind: 'interface', properties });
  }

  const typeRegex = /export\s+type\s+(\w+)\s*=\s*([^;]+);/g;
  while ((match = typeRegex.exec(content)) !== null) {
    const typeContent = match[2].trim();
    const properties: { name: string; type: string; optional: boolean }[] = [];
    if (typeContent.includes('|')) {
      const options = typeContent.split('|').map(s => s.trim());
      options.forEach((opt, i) => {
        properties.push({ name: `value_${i + 1}`, type: opt, optional: false });
      });
    }
    types.push({ name: match[1], kind: 'type', properties });
  }

  const constRegex = /export\s+const\s+(\w+)(?::\s*\w+)?\s*=\s*\{([^}]+)\}/g;
  while ((match = constRegex.exec(content)) !== null) {
    const name = match[1];
    if (name.includes('LABEL') || name.toUpperCase() === name) {
      const properties: { name: string; type: string; optional: boolean }[] = [];
      const pairRegex = /(\w+):\s*(['"`][^'"`]+['"`])/g;
      let pairMatch;
      while ((pairMatch = pairRegex.exec(match[2])) !== null) {
        properties.push({ name: pairMatch[1], type: pairMatch[2], optional: false });
      }
      types.push({ name, kind: 'const', properties });
    }
  }
  return types;
}

function analyzeStores(projectPath: string): StoreInfo[] {
  const stores: StoreInfo[] = [];
  const storeDir = path.join(projectPath, 'store');
  if (!fs.existsSync(storeDir)) return stores;
  const files = fs.readdirSync(storeDir);
  for (const file of files) {
    if (!file.endsWith('.ts')) continue;
    const filePath = path.join(storeDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const nameMatch = content.match(/export\s+const\s+use(\w+)Store/);
    const storeName = nameMatch ? nameMatch[1] : file.replace('.ts', '');
    const state: { name: string; type: string }[] = [];
    const stateMatch = content.match(/interface\s+\w*State\s*\{([^}]+)\}/s);
    if (stateMatch) {
      const lines = stateMatch[1].split('\n');
      for (const line of lines) {
        const propMatch = line.trim().match(/^(\w+)(\?)?:\s*(.+?);?\s*$/);
        if (propMatch && !propMatch[3].includes('=>')) {
          state.push({ name: propMatch[1], type: propMatch[3].replace(/;$/, '') });
        }
      }
    }
    const actions: { name: string; parameters: string }[] = [];
    const actionRegex = /(\w+):\s*\(([^)]*)\)\s*=>/g;
    let actionMatch;
    while ((actionMatch = actionRegex.exec(content)) !== null) {
      if (actionMatch[1] !== 'set' && actionMatch[1] !== 'get') {
        actions.push({ name: actionMatch[1], parameters: actionMatch[2] || 'void' });
      }
    }
    const persistMatch = content.match(/persist\s*\([^,]+,\s*\{\s*name:\s*['"]([^'"]+)['"]/);
    stores.push({
      name: storeName,
      relativePath: path.relative(projectPath, filePath),
      state,
      actions,
      persistence: persistMatch ? { name: persistMatch[1] } : null,
    });
  }
  return stores;
}

function getStyles(): string {
  return `
    :root { --primary: #1E3A5F; --accent: #2980B9; --success: #10B981; --error: #EF4444; --text: #1a1a2e; --text-muted: #64748b; --border: #e2e8f0; --bg-code: #f8fafc; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 11pt; line-height: 1.6; color: var(--text); max-width: 900px; margin: 0 auto; padding: 20px; }
    .print-notice { background: var(--accent); color: white; padding: 12px 20px; border-radius: 8px; margin-bottom: 24px; text-align: center; }
    @media print { .print-notice { display: none; } body { max-width: none; padding: 0; } }
    .cover-page { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); color: white; margin: -20px -20px 40px -20px; padding: 60px 40px; page-break-after: always; }
    .cover-page h1 { font-size: 36pt; font-weight: 700; margin-bottom: 16px; border: none; }
    .cover-page .subtitle { font-size: 18pt; opacity: 0.9; margin-bottom: 48px; }
    .cover-page .meta { font-size: 12pt; opacity: 0.8; }
    .toc { page-break-after: always; padding: 20px 0; }
    .toc h2 { font-size: 24pt; color: var(--primary); margin-bottom: 24px; border-bottom: 2px solid var(--accent); padding-bottom: 8px; }
    .toc-item { padding: 8px 0; border-bottom: 1px dotted var(--border); }
    .toc-item a { color: var(--text); text-decoration: none; }
    .toc-item.level-2 { padding-left: 24px; font-size: 10pt; }
    h1 { font-size: 24pt; color: var(--primary); margin: 40px 0 16px 0; border-bottom: 3px solid var(--accent); padding-bottom: 8px; page-break-after: avoid; }
    h2 { font-size: 18pt; color: var(--primary); margin: 32px 0 12px 0; page-break-after: avoid; }
    h3 { font-size: 14pt; color: var(--accent); margin: 24px 0 8px 0; }
    h4 { font-size: 12pt; color: var(--text); margin: 16px 0 8px 0; }
    p { margin-bottom: 12px; }
    pre { background: var(--bg-code); border: 1px solid var(--border); border-radius: 8px; padding: 16px; overflow-x: auto; font-family: 'Consolas', monospace; font-size: 9pt; line-height: 1.5; margin: 16px 0; }
    code { font-family: 'Consolas', monospace; background: var(--bg-code); padding: 2px 6px; border-radius: 4px; font-size: 9pt; }
    pre code { background: none; padding: 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10pt; }
    th { background: var(--primary); color: white; padding: 12px; text-align: left; font-weight: 600; }
    td { padding: 10px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
    tr:nth-child(even) { background: #f8fafc; }
    .component-card { border: 1px solid var(--border); border-radius: 12px; margin: 24px 0; overflow: hidden; page-break-inside: avoid; }
    .component-header { background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); color: white; padding: 16px 20px; }
    .component-header h3 { color: white; margin: 0; font-size: 14pt; }
    .component-header .file-path { font-size: 9pt; opacity: 0.8; margin-top: 4px; font-family: monospace; }
    .component-body { padding: 20px; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 8pt; font-weight: 600; text-transform: uppercase; margin-right: 4px; }
    .badge-required { background: var(--error); color: white; }
    .badge-optional { background: var(--border); color: var(--text-muted); }
    .badge-type { background: var(--accent); color: white; }
    .badge-persist { background: var(--success); color: white; }
    ul, ol { margin: 12px 0; padding-left: 24px; }
    li { margin-bottom: 6px; }
    .page-break { page-break-after: always; }
    @media print { .page-break { page-break-after: always; } .component-card { page-break-inside: avoid; } h1, h2, h3 { page-break-after: avoid; } }
  `;
}

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateComponentCard(c: ComponentInfo): string {
  const propsTable = c.props.length > 0 ? `
    <h4>${LABELS.props}</h4>
    <table><thead><tr><th>Nom</th><th>Type</th><th>Statut</th></tr></thead><tbody>
      ${c.props.map(p => `<tr><td><code>${esc(p.name)}</code></td><td><code>${esc(p.type)}</code></td><td><span class="badge ${p.required ? 'badge-required' : 'badge-optional'}">${p.required ? LABELS.required : LABELS.optional}</span></td></tr>`).join('')}
    </tbody></table>
  ` : `<p><em>${LABELS.noProps}</em></p>`;
  const hooksSection = c.hooks.length > 0 ? `<h4>${LABELS.hooks}</h4><p>${c.hooks.map(h => `<code>${esc(h)}</code>`).join(', ')}</p>` : '';
  return `<div class="component-card"><div class="component-header"><h3>${esc(c.name)}</h3><div class="file-path">${esc(c.relativePath)}</div></div><div class="component-body">${propsTable}${hooksSection}</div></div>`;
}

function generateTypeCard(t: TypeInfo): string {
  const kindLabel = { interface: 'Interface', type: 'Type', const: 'Const' }[t.kind];
  return `<div class="component-card"><div class="component-header"><h3>${esc(t.name)}</h3><div class="file-path"><span class="badge badge-type">${kindLabel}</span></div></div><div class="component-body">
    <table><thead><tr><th>Propriete</th><th>Type</th><th>Statut</th></tr></thead><tbody>
      ${t.properties.map(p => `<tr><td><code>${esc(p.name)}</code></td><td><code>${esc(p.type)}</code></td><td>${p.optional ? LABELS.optional : LABELS.required}</td></tr>`).join('')}
    </tbody></table>
  </div></div>`;
}

function generateStoreCard(s: StoreInfo): string {
  return `<div class="component-card"><div class="component-header"><h3>use${esc(s.name)}Store</h3><div class="file-path">${s.persistence ? `<span class="badge badge-persist">${LABELS.persistence}</span>` : ''}${esc(s.relativePath)}</div></div><div class="component-body">
    <h4>${LABELS.state}</h4>
    <table><thead><tr><th>Propriete</th><th>Type</th></tr></thead><tbody>${s.state.map(p => `<tr><td><code>${esc(p.name)}</code></td><td><code>${esc(p.type)}</code></td></tr>`).join('')}</tbody></table>
    <h4>${LABELS.actions}</h4>
    <table><thead><tr><th>Action</th><th>Parametres</th></tr></thead><tbody>${s.actions.map(a => `<tr><td><code>${esc(a.name)}</code></td><td><code>${esc(a.parameters)}</code></td></tr>`).join('')}</tbody></table>
  </div></div>`;
}

function generateDoc(options: GenerateHTMLOptions): string {
  const { type, projectPath, projectName } = options;
  const components = analyzeComponents(projectPath);
  const types = analyzeTypes(projectPath);
  const stores = analyzeStores(projectPath);

  const ui = components.filter(c => c.category === 'ui');
  const shared = components.filter(c => c.category === 'shared');
  const layout = components.filter(c => c.category === 'layout');
  const pages = components.filter(c => c.category === 'page');
  const interfaces = types.filter(t => t.kind === 'interface');
  const typeAliases = types.filter(t => t.kind === 'type');
  const constants = types.filter(t => t.kind === 'const');

  const date = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const docTitle = { components: 'Documentation des Composants', architecture: 'Documentation d\'Architecture', developer: 'Guide du Developpeur', types: 'Documentation des Types', all: 'Documentation Complete' }[type];

  let toc = '', content = '';

  if (type === 'components' || type === 'all') {
    toc += `<div class="toc-item"><a href="#components">${LABELS.components}</a></div>
      <div class="toc-item level-2"><a href="#ui">${LABELS.uiComponents} (${ui.length})</a></div>
      <div class="toc-item level-2"><a href="#shared">${LABELS.sharedComponents} (${shared.length})</a></div>
      <div class="toc-item level-2"><a href="#layout">${LABELS.layoutComponents} (${layout.length})</a></div>
      <div class="toc-item level-2"><a href="#pages">${LABELS.pageComponents} (${pages.length})</a></div>`;
    content += `<h1 id="components">${LABELS.components}</h1><p>Documentation des ${components.length} composants React.</p>
      <h2 id="ui">${LABELS.uiComponents}</h2><p>Composants Shadcn/ui et Radix UI.</p>${ui.map(generateComponentCard).join('')}
      <h2 id="shared">${LABELS.sharedComponents}</h2><p>Composants metier reutilisables.</p>${shared.map(generateComponentCard).join('')}
      <h2 id="layout">${LABELS.layoutComponents}</h2><p>Composants de mise en page.</p>${layout.map(generateComponentCard).join('')}
      <h2 id="pages">${LABELS.pageComponents}</h2><p>Composants de pages.</p>${pages.map(generateComponentCard).join('')}
      <div class="page-break"></div>`;
  }

  if (type === 'types' || type === 'all') {
    toc += `<div class="toc-item"><a href="#types">${LABELS.types}</a></div>
      <div class="toc-item level-2"><a href="#interfaces">${LABELS.interfaces} (${interfaces.length})</a></div>
      <div class="toc-item level-2"><a href="#typealiases">${LABELS.typeAliases} (${typeAliases.length})</a></div>
      <div class="toc-item level-2"><a href="#constants">${LABELS.constants} (${constants.length})</a></div>`;
    content += `<h1 id="types">${LABELS.types}</h1><p>Reference des ${types.length} definitions TypeScript.</p>
      <h2 id="interfaces">${LABELS.interfaces}</h2>${interfaces.map(generateTypeCard).join('')}
      <h2 id="typealiases">${LABELS.typeAliases}</h2>${typeAliases.map(generateTypeCard).join('')}
      <h2 id="constants">${LABELS.constants}</h2>${constants.map(generateTypeCard).join('')}
      <div class="page-break"></div>`;
  }

  if (type === 'architecture' || type === 'all') {
    toc += `<div class="toc-item"><a href="#arch">${LABELS.architecture}</a></div>
      <div class="toc-item level-2"><a href="#tech">${LABELS.techStack}</a></div>
      <div class="toc-item level-2"><a href="#dirs">${LABELS.directoryStructure}</a></div>
      <div class="toc-item level-2"><a href="#stores">${LABELS.stateManagement}</a></div>`;
    content += `<h1 id="arch">${LABELS.architecture}</h1><p>Vue d'ensemble technique.</p>
      <h2 id="tech">${LABELS.techStack}</h2>
      <table><thead><tr><th>Categorie</th><th>Technologie</th></tr></thead><tbody>
        <tr><td>Framework</td><td>React 18 + TypeScript</td></tr>
        <tr><td>Build</td><td>Vite</td></tr>
        <tr><td>Styling</td><td>TailwindCSS</td></tr>
        <tr><td>UI</td><td>Shadcn/ui (Radix UI)</td></tr>
        <tr><td>State</td><td>Zustand</td></tr>
        <tr><td>Routing</td><td>React Router v6</td></tr>
      </tbody></table>
      <h2 id="dirs">${LABELS.directoryStructure}</h2>
      <pre><code>src/
├── components/
│   ├── ui/           # Composants Shadcn/ui
│   ├── shared/       # Composants metier
│   └── layout/       # Layout components
├── pages/            # Pages
├── store/            # Stores Zustand
├── hooks/            # Custom hooks
├── types/            # Types TypeScript
├── data/             # Donnees mockees
└── App.tsx</code></pre>
      <h2 id="stores">${LABELS.stateManagement}</h2><p>${stores.length} stores Zustand avec persistance.</p>${stores.map(generateStoreCard).join('')}
      <div class="page-break"></div>`;
  }

  if (type === 'developer' || type === 'all') {
    toc += `<div class="toc-item"><a href="#dev">${LABELS.developerGuide}</a></div>
      <div class="toc-item level-2"><a href="#setup">${LABELS.setup}</a></div>
      <div class="toc-item level-2"><a href="#conv">${LABELS.conventions}</a></div>`;
    content += `<h1 id="dev">${LABELS.developerGuide}</h1>
      <h2 id="setup">${LABELS.setup}</h2>
      <h3>Prerequisites</h3><ul><li>Node.js 18+</li><li>npm</li></ul>
      <h3>Installation</h3><pre><code>git clone [url]
cd ${projectName}
npm install
npm run dev</code></pre>
      <h3>Scripts</h3>
      <table><thead><tr><th>Commande</th><th>Description</th></tr></thead><tbody>
        <tr><td><code>npm run dev</code></td><td>Serveur de developpement</td></tr>
        <tr><td><code>npm run build</code></td><td>Build production</td></tr>
        <tr><td><code>npm run lint</code></td><td>ESLint</td></tr>
      </tbody></table>
      <h2 id="conv">${LABELS.conventions}</h2>
      <table><thead><tr><th>Type</th><th>Convention</th><th>Exemple</th></tr></thead><tbody>
        <tr><td>Composant</td><td>PascalCase</td><td>ParticipantCard.tsx</td></tr>
        <tr><td>Hook</td><td>camelCase</td><td>useAuth.ts</td></tr>
        <tr><td>Store</td><td>camelCase</td><td>authStore.ts</td></tr>
      </tbody></table>
      <h3>Bonnes pratiques</h3><ul><li>Un composant = un fichier</li><li>Textes en francais</li><li>TypeScript strict</li></ul>`;
  }

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${esc(projectName)} - Documentation</title><style>${getStyles()}</style></head><body>
    <div class="print-notice">${LABELS.printToPdf}</div>
    <div class="cover-page"><h1>${esc(projectName)}</h1><div class="subtitle">${docTitle}</div><div class="meta">${LABELS.generatedOn} ${date}</div></div>
    <div class="toc"><h2>${LABELS.tableOfContents}</h2>${toc}</div>
    ${content}
  </body></html>`;
}

function main() {
  const args = process.argv.slice(2);
  const opts: Partial<GenerateHTMLOptions> = { language: 'fr', projectName: 'BusinessConnect', type: 'all' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--type') opts.type = args[++i] as any;
    else if (args[i] === '--project') opts.projectPath = args[++i];
    else if (args[i] === '--output') opts.outputPath = args[++i];
    else if (args[i] === '--name') opts.projectName = args[++i];
  }
  if (!opts.projectPath || !opts.outputPath) {
    console.error('Usage: generate-html.ts --project <path> --output <path> [--type all|components|types|architecture|developer]');
    process.exit(1);
  }
  console.log(`Generating ${opts.type} documentation...`);
  const html = generateDoc(opts as GenerateHTMLOptions);
  const dir = path.dirname(opts.outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(opts.outputPath, html);
  console.log(`Documentation HTML generee: ${opts.outputPath}`);
  console.log('\nPour convertir en PDF:');
  console.log('1. Ouvrez le fichier HTML dans votre navigateur');
  console.log('2. Appuyez sur Ctrl+P (Windows/Linux) ou Cmd+P (Mac)');
  console.log('3. Selectionnez "Enregistrer en PDF"');
}

main();
