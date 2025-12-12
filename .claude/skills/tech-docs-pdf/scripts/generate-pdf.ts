#!/usr/bin/env npx ts-node

/**
 * generate-pdf.ts
 *
 * Generates professional PDF documentation from analyzed React/TypeScript project data.
 * Uses Puppeteer for HTML-to-PDF conversion with custom templates.
 *
 * Usage:
 *   npx ts-node generate-pdf.ts --type <type> --project <path> --output <path> [--lang fr|en] [--name <project-name>]
 */

import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES
// ============================================================================

interface GeneratePDFOptions {
  type: 'components' | 'architecture' | 'developer' | 'types';
  projectPath: string;
  outputPath: string;
  language: 'fr' | 'en';
  projectName: string;
}

interface ComponentInfo {
  name: string;
  filePath: string;
  relativePath: string;
  props: PropInfo[];
  imports: { module: string; named: string[]; defaultImport?: string }[];
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

interface StoreInfo {
  name: string;
  filePath: string;
  relativePath: string;
  state: { name: string; type: string; description?: string }[];
  actions: { name: string; parameters: string; description?: string }[];
  persistence: { name: string; storage: string } | null;
  description: string;
}

// ============================================================================
// LABELS
// ============================================================================

const FRENCH_LABELS = {
  tableOfContents: 'Table des matieres',
  components: 'Composants',
  architecture: 'Architecture',
  types: 'Types et Interfaces',
  stores: 'Gestion d\'etat',
  props: 'Proprietes',
  usage: 'Utilisation',
  example: 'Exemple',
  generatedOn: 'Genere le',
  page: 'Page',
  overview: 'Vue d\'ensemble',
  routing: 'Routage',
  stateManagement: 'Gestion d\'etat',
  projectStructure: 'Structure du projet',
  conventions: 'Conventions',
  setup: 'Installation',
  developerGuide: 'Guide du developpeur',
  apiReference: 'Reference API',
  required: 'Requis',
  optional: 'Optionnel',
  defaultValue: 'Valeur par defaut',
  actions: 'Actions',
  state: 'Etat',
  uiComponents: 'Composants UI',
  sharedComponents: 'Composants Partages',
  layoutComponents: 'Composants Layout',
  pageComponents: 'Pages',
  hooks: 'Hooks utilises',
  imports: 'Imports',
  noProps: 'Aucune propriete',
  interfaces: 'Interfaces',
  typeAliases: 'Types',
  enums: 'Enumerations',
  constants: 'Constantes',
  persistence: 'Persistance',
  techStack: 'Stack Technique',
  directoryStructure: 'Structure des Dossiers',
};

const ENGLISH_LABELS = {
  tableOfContents: 'Table of Contents',
  components: 'Components',
  architecture: 'Architecture',
  types: 'Types and Interfaces',
  stores: 'State Management',
  props: 'Properties',
  usage: 'Usage',
  example: 'Example',
  generatedOn: 'Generated on',
  page: 'Page',
  overview: 'Overview',
  routing: 'Routing',
  stateManagement: 'State Management',
  projectStructure: 'Project Structure',
  conventions: 'Conventions',
  setup: 'Setup',
  developerGuide: 'Developer Guide',
  apiReference: 'API Reference',
  required: 'Required',
  optional: 'Optional',
  defaultValue: 'Default value',
  actions: 'Actions',
  state: 'State',
  uiComponents: 'UI Components',
  sharedComponents: 'Shared Components',
  layoutComponents: 'Layout Components',
  pageComponents: 'Pages',
  hooks: 'Hooks used',
  imports: 'Imports',
  noProps: 'No properties',
  interfaces: 'Interfaces',
  typeAliases: 'Types',
  enums: 'Enums',
  constants: 'Constants',
  persistence: 'Persistence',
  techStack: 'Tech Stack',
  directoryStructure: 'Directory Structure',
};

function getLabels(language: 'fr' | 'en') {
  return language === 'fr' ? FRENCH_LABELS : ENGLISH_LABELS;
}

// ============================================================================
// STYLES
// ============================================================================

function getBaseStyles(): string {
  return `
    :root {
      --primary: #1E3A5F;
      --accent: #2980B9;
      --success: #10B981;
      --error: #EF4444;
      --warning: #F59E0B;
      --text: #1a1a2e;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --bg-code: #f8fafc;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: var(--text);
    }

    .cover-page {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: white;
      page-break-after: always;
    }

    .cover-page h1 {
      font-size: 36pt;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .cover-page .subtitle {
      font-size: 18pt;
      opacity: 0.9;
      margin-bottom: 48px;
    }

    .cover-page .meta {
      font-size: 12pt;
      opacity: 0.8;
    }

    .toc {
      page-break-after: always;
      padding: 40px;
    }

    .toc h2 {
      font-size: 24pt;
      color: var(--primary);
      margin-bottom: 24px;
      border-bottom: 2px solid var(--accent);
      padding-bottom: 8px;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px dotted var(--border);
    }

    .toc-item a {
      color: var(--text);
      text-decoration: none;
    }

    .toc-item.level-2 {
      padding-left: 24px;
      font-size: 10pt;
    }

    .section {
      padding: 40px;
    }

    h1 {
      font-size: 24pt;
      color: var(--primary);
      margin-bottom: 16px;
      border-bottom: 3px solid var(--accent);
      padding-bottom: 8px;
    }

    h2 {
      font-size: 18pt;
      color: var(--primary);
      margin-top: 32px;
      margin-bottom: 12px;
    }

    h3 {
      font-size: 14pt;
      color: var(--accent);
      margin-top: 24px;
      margin-bottom: 8px;
    }

    h4 {
      font-size: 12pt;
      color: var(--text);
      margin-top: 16px;
      margin-bottom: 8px;
    }

    p {
      margin-bottom: 12px;
    }

    pre {
      background: var(--bg-code);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 9pt;
      line-height: 1.5;
      margin: 16px 0;
    }

    code {
      font-family: 'Fira Code', 'Consolas', monospace;
      background: var(--bg-code);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9pt;
    }

    pre code {
      background: none;
      padding: 0;
    }

    .keyword { color: #8B5CF6; font-weight: 600; }
    .string { color: #10B981; }
    .number { color: #F59E0B; }
    .comment { color: #64748b; font-style: italic; }
    .type { color: #2980B9; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 10pt;
    }

    th {
      background: var(--primary);
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
    }

    tr:nth-child(even) {
      background: #f8fafc;
    }

    .component-card {
      border: 1px solid var(--border);
      border-radius: 12px;
      margin: 24px 0;
      overflow: hidden;
      page-break-inside: avoid;
    }

    .component-header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: white;
      padding: 16px 20px;
    }

    .component-header h3 {
      color: white;
      margin: 0;
      font-size: 14pt;
    }

    .component-header .file-path {
      font-size: 9pt;
      opacity: 0.8;
      margin-top: 4px;
    }

    .component-body {
      padding: 20px;
    }

    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 8pt;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-required {
      background: var(--error);
      color: white;
    }

    .badge-optional {
      background: var(--border);
      color: var(--text-muted);
    }

    .badge-type {
      background: var(--accent);
      color: white;
    }

    .badge-persist {
      background: var(--success);
      color: white;
    }

    ul, ol {
      margin: 12px 0;
      padding-left: 24px;
    }

    li {
      margin-bottom: 6px;
    }

    .page-break {
      page-break-after: always;
    }

    .no-break {
      page-break-inside: avoid;
    }

    @media print {
      .page-break {
        page-break-after: always;
      }
    }
  `;
}

// ============================================================================
// HTML GENERATORS
// ============================================================================

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function highlightCode(code: string): string {
  return escapeHtml(code)
    .replace(/\b(import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|enum|extends|implements|async|await|default|new)\b/g, '<span class="keyword">$1</span>')
    .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
    .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
    .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
    .replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
}

function generateCoverPage(projectName: string, docType: string, language: 'fr' | 'en'): string {
  const labels = getLabels(language);
  const docTypeLabels: Record<string, string> = {
    components: language === 'fr' ? 'Documentation des Composants' : 'Component Documentation',
    architecture: language === 'fr' ? 'Documentation d\'Architecture' : 'Architecture Documentation',
    developer: language === 'fr' ? 'Guide du Developpeur' : 'Developer Guide',
    types: language === 'fr' ? 'Documentation des Types' : 'Types Documentation'
  };

  const date = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <div class="cover-page">
      <h1>${escapeHtml(projectName)}</h1>
      <div class="subtitle">${docTypeLabels[docType]}</div>
      <div class="meta">${labels.generatedOn} ${date}</div>
    </div>
  `;
}

function generateTableOfContents(sections: { id: string; title: string; level: number }[], language: 'fr' | 'en'): string {
  const labels = getLabels(language);

  const items = sections.map(section => `
    <div class="toc-item level-${section.level}">
      <a href="#${section.id}">${escapeHtml(section.title)}</a>
    </div>
  `).join('');

  return `
    <div class="toc">
      <h2>${labels.tableOfContents}</h2>
      ${items}
    </div>
  `;
}

function generateComponentCard(component: ComponentInfo, labels: typeof FRENCH_LABELS): string {
  const propsTable = component.props.length > 0 ? `
    <h4>${labels.props}</h4>
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Type</th>
          <th>Statut</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${component.props.map(prop => `
          <tr>
            <td><code>${escapeHtml(prop.name)}</code></td>
            <td><code>${escapeHtml(prop.type)}</code></td>
            <td>
              <span class="badge ${prop.required ? 'badge-required' : 'badge-optional'}">
                ${prop.required ? labels.required : labels.optional}
              </span>
            </td>
            <td>${prop.description ? escapeHtml(prop.description) : '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : `<p><em>${labels.noProps}</em></p>`;

  const hooksSection = component.hooks.length > 0 ? `
    <h4>${labels.hooks}</h4>
    <p>${component.hooks.map(h => `<code>${escapeHtml(h)}</code>`).join(', ')}</p>
  ` : '';

  return `
    <div class="component-card" id="component-${component.name.toLowerCase()}">
      <div class="component-header">
        <h3>${escapeHtml(component.name)}</h3>
        <div class="file-path">${escapeHtml(component.relativePath)}</div>
      </div>
      <div class="component-body">
        <p>${escapeHtml(component.description)}</p>
        ${propsTable}
        ${hooksSection}
      </div>
    </div>
  `;
}

function generateTypeCard(typeInfo: TypeInfo, labels: typeof FRENCH_LABELS): string {
  const kindLabels: Record<string, string> = {
    interface: 'Interface',
    type: 'Type',
    enum: 'Enum',
    const: 'Const'
  };

  return `
    <div class="component-card no-break" id="type-${typeInfo.name.toLowerCase()}">
      <div class="component-header">
        <h3>${escapeHtml(typeInfo.name)}</h3>
        <div class="file-path">
          <span class="badge badge-type">${kindLabels[typeInfo.kind]}</span>
          ${escapeHtml(typeInfo.relativePath)}
        </div>
      </div>
      <div class="component-body">
        ${typeInfo.description ? `<p>${escapeHtml(typeInfo.description)}</p>` : ''}
        <table>
          <thead>
            <tr>
              <th>Propriete</th>
              <th>Type</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${typeInfo.properties.map(prop => `
              <tr>
                <td><code>${escapeHtml(prop.name)}</code></td>
                <td><code>${escapeHtml(prop.type)}</code></td>
                <td>${prop.optional ? labels.optional : labels.required}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h4>Definition</h4>
        <pre><code>${highlightCode(typeInfo.rawDefinition)}</code></pre>
      </div>
    </div>
  `;
}

function generateStoreCard(store: StoreInfo, labels: typeof FRENCH_LABELS): string {
  return `
    <div class="component-card" id="store-${store.name.toLowerCase()}">
      <div class="component-header">
        <h3>use${escapeHtml(store.name)}Store</h3>
        <div class="file-path">
          ${store.persistence ? `<span class="badge badge-persist">${labels.persistence}</span>` : ''}
          ${escapeHtml(store.relativePath)}
        </div>
      </div>
      <div class="component-body">
        <p>${escapeHtml(store.description)}</p>

        <h4>${labels.state}</h4>
        <table>
          <thead>
            <tr>
              <th>Propriete</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            ${store.state.map(prop => `
              <tr>
                <td><code>${escapeHtml(prop.name)}</code></td>
                <td><code>${escapeHtml(prop.type)}</code></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h4>${labels.actions}</h4>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Parametres</th>
            </tr>
          </thead>
          <tbody>
            ${store.actions.map(action => `
              <tr>
                <td><code>${escapeHtml(action.name)}</code></td>
                <td><code>${escapeHtml(action.parameters)}</code></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================================
// CONTENT GENERATORS
// ============================================================================

function generateComponentsContent(projectPath: string, labels: typeof FRENCH_LABELS): { html: string; sections: { id: string; title: string; level: number }[] } {
  const sections: { id: string; title: string; level: number }[] = [];
  let html = '';

  // Try to load analyzed components
  const componentsPath = path.join(projectPath, 'components');
  const pagesPath = path.join(projectPath, 'pages');

  sections.push({ id: 'overview', title: labels.overview, level: 1 });

  html += `
    <div class="section" id="overview">
      <h1>${labels.components}</h1>
      <p>Documentation complete des composants React du projet.</p>
    </div>
  `;

  // UI Components
  if (fs.existsSync(path.join(componentsPath, 'ui'))) {
    sections.push({ id: 'ui-components', title: labels.uiComponents, level: 2 });
    html += `
      <div class="section" id="ui-components">
        <h2>${labels.uiComponents}</h2>
        <p>Composants de base construits avec Shadcn/ui et Radix UI.</p>
      </div>
    `;
  }

  // Shared Components
  if (fs.existsSync(path.join(componentsPath, 'shared'))) {
    sections.push({ id: 'shared-components', title: labels.sharedComponents, level: 2 });
    html += `
      <div class="section" id="shared-components">
        <h2>${labels.sharedComponents}</h2>
        <p>Composants metier reutilisables a travers l'application.</p>
      </div>
    `;
  }

  // Layout Components
  if (fs.existsSync(path.join(componentsPath, 'layout'))) {
    sections.push({ id: 'layout-components', title: labels.layoutComponents, level: 2 });
    html += `
      <div class="section" id="layout-components">
        <h2>${labels.layoutComponents}</h2>
        <p>Composants de mise en page et navigation.</p>
      </div>
    `;
  }

  // Pages
  if (fs.existsSync(pagesPath)) {
    sections.push({ id: 'page-components', title: labels.pageComponents, level: 2 });
    html += `
      <div class="section page-break" id="page-components">
        <h2>${labels.pageComponents}</h2>
        <p>Composants de pages correspondant aux routes de l'application.</p>
      </div>
    `;
  }

  return { html, sections };
}

function generateTypesContent(projectPath: string, labels: typeof FRENCH_LABELS): { html: string; sections: { id: string; title: string; level: number }[] } {
  const sections: { id: string; title: string; level: number }[] = [];
  let html = '';

  sections.push({ id: 'types-overview', title: labels.overview, level: 1 });
  sections.push({ id: 'interfaces', title: labels.interfaces, level: 2 });
  sections.push({ id: 'type-aliases', title: labels.typeAliases, level: 2 });
  sections.push({ id: 'constants', title: labels.constants, level: 2 });

  html += `
    <div class="section" id="types-overview">
      <h1>${labels.types}</h1>
      <p>Reference complete des types TypeScript du projet.</p>
    </div>

    <div class="section" id="interfaces">
      <h2>${labels.interfaces}</h2>
      <p>Interfaces TypeScript definissant les structures de donnees.</p>
    </div>

    <div class="section" id="type-aliases">
      <h2>${labels.typeAliases}</h2>
      <p>Alias de types et types union.</p>
    </div>

    <div class="section" id="constants">
      <h2>${labels.constants}</h2>
      <p>Constantes et objets de configuration.</p>
    </div>
  `;

  return { html, sections };
}

function generateArchitectureContent(projectPath: string, labels: typeof FRENCH_LABELS): { html: string; sections: { id: string; title: string; level: number }[] } {
  const sections: { id: string; title: string; level: number }[] = [];
  let html = '';

  sections.push({ id: 'arch-overview', title: labels.overview, level: 1 });
  sections.push({ id: 'tech-stack', title: labels.techStack, level: 2 });
  sections.push({ id: 'directory-structure', title: labels.directoryStructure, level: 2 });
  sections.push({ id: 'routing', title: labels.routing, level: 2 });
  sections.push({ id: 'state-management', title: labels.stateManagement, level: 2 });

  html += `
    <div class="section" id="arch-overview">
      <h1>${labels.architecture}</h1>
      <p>Vue d'ensemble de l'architecture technique du projet.</p>
    </div>

    <div class="section" id="tech-stack">
      <h2>${labels.techStack}</h2>
      <table>
        <thead>
          <tr><th>Categorie</th><th>Technologie</th></tr>
        </thead>
        <tbody>
          <tr><td>Framework</td><td>React 18 + TypeScript</td></tr>
          <tr><td>Build</td><td>Vite</td></tr>
          <tr><td>Styling</td><td>TailwindCSS</td></tr>
          <tr><td>UI Components</td><td>Shadcn/ui (Radix UI)</td></tr>
          <tr><td>State Management</td><td>Zustand</td></tr>
          <tr><td>Routing</td><td>React Router v6</td></tr>
          <tr><td>Icons</td><td>Lucide React</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section" id="directory-structure">
      <h2>${labels.directoryStructure}</h2>
      <pre><code>src/
├── components/
│   ├── ui/           # Composants Shadcn/ui
│   ├── shared/       # Composants metier
│   └── layout/       # Layout components
├── pages/            # Pages de l'application
├── layouts/          # Layouts partages
├── store/            # Stores Zustand
├── hooks/            # Custom hooks
├── types/            # Types TypeScript
├── data/             # Donnees mockees
├── lib/              # Utilitaires
└── App.tsx           # Point d'entree</code></pre>
    </div>

    <div class="section" id="routing">
      <h2>${labels.routing}</h2>
      <p>Structure des routes avec React Router v6.</p>
    </div>

    <div class="section page-break" id="state-management">
      <h2>${labels.stateManagement}</h2>
      <p>Gestion d'etat avec Zustand et persistance localStorage.</p>
    </div>
  `;

  return { html, sections };
}

function generateDeveloperContent(projectPath: string, labels: typeof FRENCH_LABELS): { html: string; sections: { id: string; title: string; level: number }[] } {
  const sections: { id: string; title: string; level: number }[] = [];
  let html = '';

  sections.push({ id: 'dev-overview', title: labels.overview, level: 1 });
  sections.push({ id: 'setup', title: labels.setup, level: 2 });
  sections.push({ id: 'conventions', title: labels.conventions, level: 2 });

  html += `
    <div class="section" id="dev-overview">
      <h1>${labels.developerGuide}</h1>
      <p>Guide complet pour les developpeurs travaillant sur le projet.</p>
    </div>

    <div class="section" id="setup">
      <h2>${labels.setup}</h2>
      <h3>Prerequisites</h3>
      <ul>
        <li>Node.js 18+</li>
        <li>npm ou yarn</li>
      </ul>

      <h3>Installation</h3>
      <pre><code># Cloner le repository
git clone [repository-url]
cd project

# Installer les dependances
npm install

# Lancer en developpement
npm run dev</code></pre>

      <h3>Scripts disponibles</h3>
      <table>
        <thead>
          <tr><th>Commande</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>npm run dev</code></td><td>Lance le serveur de developpement</td></tr>
          <tr><td><code>npm run build</code></td><td>Build pour production</td></tr>
          <tr><td><code>npm run lint</code></td><td>Verifie le code avec ESLint</td></tr>
          <tr><td><code>npm run preview</code></td><td>Preview du build de production</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section" id="conventions">
      <h2>${labels.conventions}</h2>

      <h3>Nommage des fichiers</h3>
      <table>
        <thead>
          <tr><th>Type</th><th>Convention</th><th>Exemple</th></tr>
        </thead>
        <tbody>
          <tr><td>Composant</td><td>PascalCase</td><td>ParticipantCard.tsx</td></tr>
          <tr><td>Hook</td><td>camelCase avec 'use'</td><td>useAuth.ts</td></tr>
          <tr><td>Store</td><td>camelCase avec 'Store'</td><td>authStore.ts</td></tr>
          <tr><td>Type/Interface</td><td>PascalCase</td><td>Participant.ts</td></tr>
          <tr><td>Utilitaire</td><td>camelCase</td><td>formatDate.ts</td></tr>
        </tbody>
      </table>

      <h3>Bonnes pratiques</h3>
      <ul>
        <li>Un composant = un fichier</li>
        <li>Textes utilisateur en francais</li>
        <li>TypeScript strict (pas de 'any')</li>
        <li>Composants fonctionnels avec hooks</li>
        <li>Tests manuels avant validation</li>
      </ul>
    </div>
  `;

  return { html, sections };
}

// ============================================================================
// MAIN PDF GENERATION
// ============================================================================

async function generatePDF(options: GeneratePDFOptions): Promise<void> {
  const { type, projectPath, outputPath, language, projectName } = options;
  const labels = getLabels(language);

  let content: { html: string; sections: { id: string; title: string; level: number }[] };

  switch (type) {
    case 'components':
      content = generateComponentsContent(projectPath, labels);
      break;
    case 'types':
      content = generateTypesContent(projectPath, labels);
      break;
    case 'architecture':
      content = generateArchitectureContent(projectPath, labels);
      break;
    case 'developer':
      content = generateDeveloperContent(projectPath, labels);
      break;
    default:
      throw new Error(`Unknown documentation type: ${type}`);
  }

  const html = `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(projectName)} - Documentation</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      ${generateCoverPage(projectName, type, language)}
      ${generateTableOfContents(content.sections, language)}
      ${content.html}
    </body>
    </html>
  `;

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Launch Puppeteer and generate PDF
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    console.log('Generating PDF...');
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1in',
        right: '0.75in',
        bottom: '1in',
        left: '0.75in'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 9pt; color: #64748b; width: 100%; text-align: center; padding: 10px;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    });

    console.log(`PDF generated successfully: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

// ============================================================================
// CLI
// ============================================================================

function parseArgs(): GeneratePDFOptions {
  const args = process.argv.slice(2);
  const options: Partial<GeneratePDFOptions> = {
    language: 'fr',
    projectName: 'BusinessConnect'
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--type':
        options.type = args[++i] as GeneratePDFOptions['type'];
        break;
      case '--project':
        options.projectPath = args[++i];
        break;
      case '--output':
        options.outputPath = args[++i];
        break;
      case '--lang':
        options.language = args[++i] as 'fr' | 'en';
        break;
      case '--name':
        options.projectName = args[++i];
        break;
    }
  }

  if (!options.type || !options.projectPath || !options.outputPath) {
    console.error('Usage: generate-pdf.ts --type <type> --project <path> --output <path> [--lang fr|en] [--name <project-name>]');
    console.error('');
    console.error('Types: components, architecture, types, developer');
    console.error('');
    console.error('Example:');
    console.error('  npx ts-node generate-pdf.ts --type components --project ./src --output ./docs/components.pdf');
    process.exit(1);
  }

  return options as GeneratePDFOptions;
}

async function main() {
  const options = parseArgs();
  await generatePDF(options);
}

main().catch((error) => {
  console.error('Error generating PDF:', error);
  process.exit(1);
});
