---
name: tech-docs-pdf
description: This skill should be used when the user asks to "generate technical documentation", "create PDF documentation", "document React components", "generate architecture docs", "create developer guide", "export TypeScript documentation", "documenter le projet", "generer documentation PDF", or needs to create professional PDF documentation for a React/TypeScript codebase. Supports component documentation, architecture overview, type references, and developer guides.
---

# Technical Documentation PDF Generator

## Overview

This skill generates professional technical documentation in PDF format for React/TypeScript projects. It analyzes the codebase and produces well-formatted PDF documents using Puppeteer for HTML-to-PDF conversion.

## Supported Documentation Types

| Type | Description | Command |
|------|-------------|---------|
| `components` | Documentation des composants React avec props, exemples et hooks | `--type components` |
| `architecture` | Vue d'ensemble du projet, routing, state management | `--type architecture` |
| `types` | Reference TypeScript : interfaces, types, enums | `--type types` |
| `developer` | Guide developpeur : setup, conventions, workflow | `--type developer` |

## Quick Start

### Prerequisites

```bash
npm install --save-dev puppeteer
```

### Generate Documentation

```bash
# Documentation des composants
npx ts-node .claude/skills/tech-docs-pdf/scripts/generate-pdf.ts \
  --type components \
  --project ./src \
  --output ./docs/components.pdf \
  --lang fr

# Documentation d'architecture
npx ts-node .claude/skills/tech-docs-pdf/scripts/generate-pdf.ts \
  --type architecture \
  --project ./src \
  --output ./docs/architecture.pdf \
  --lang fr

# Documentation des types
npx ts-node .claude/skills/tech-docs-pdf/scripts/generate-pdf.ts \
  --type types \
  --project ./src/types \
  --output ./docs/types.pdf \
  --lang fr
```

## Workflow for Each Documentation Type

### 1. Component Documentation (`components`)

Generates documentation for React components including:
- Component name and file path
- Props interface with types and descriptions
- Hooks used within the component
- Usage examples with code snippets

**Process:**
1. Run `analyze-components.ts` to extract component metadata
2. Generate HTML using `component-doc.html` template
3. Convert to PDF with Puppeteer

**Example output sections:**
- Vue d'ensemble des composants
- Composants UI (Shadcn/ui)
- Composants partagés (ParticipantCard, ChatBot, etc.)
- Composants de layout (Sidebar, Header, BottomNav)
- Pages (Dashboard, Participants, Agenda, etc.)

### 2. Architecture Documentation (`architecture`)

Generates a system overview including:
- Technology stack summary
- Directory structure
- Routing architecture with route guards
- State management (Zustand stores)
- Data flow patterns

**Process:**
1. Analyze App.tsx for routing structure
2. Analyze store files for state management
3. Generate architecture diagrams (text-based)
4. Compile into PDF

### 3. Types Documentation (`types`)

Generates TypeScript reference documentation:
- Interfaces with property tables
- Type aliases with union types
- Enums with value mappings
- Constants with their values

**Process:**
1. Run `analyze-types.ts` on `/src/types/`
2. Format each type with properties table
3. Generate cross-references
4. Compile into PDF

### 4. Developer Guide (`developer`)

Generates onboarding documentation:
- Installation and setup
- Development workflow
- Code conventions and patterns
- Testing guidelines

## Script Reference

### generate-pdf.ts

Main PDF generation script using Puppeteer.

```bash
npx ts-node scripts/generate-pdf.ts [options]

Options:
  --type <type>       Documentation type: components|architecture|types|developer
  --project <path>    Project source directory (default: ./src)
  --output <path>     Output PDF file path (required)
  --lang <lang>       Language: fr|en (default: fr)
  --name <name>       Project name (default: BusinessConnect)
```

### analyze-components.ts

Extracts component information using TypeScript AST.

```bash
npx ts-node scripts/analyze-components.ts <directory> [--output <json-path>]
```

Output JSON structure:
```json
{
  "name": "ParticipantCard",
  "filePath": "src/components/shared/ParticipantCard.tsx",
  "props": [
    { "name": "participant", "type": "Participant", "required": true }
  ],
  "hooks": ["useState", "useNavigate"],
  "imports": ["react", "react-router-dom", "@/types"]
}
```

### analyze-types.ts

Parses TypeScript type definitions.

```bash
npx ts-node scripts/analyze-types.ts <path> [--output <json-path>]
```

Output JSON structure:
```json
{
  "name": "Participant",
  "kind": "interface",
  "properties": [
    { "name": "id", "type": "string", "optional": false },
    { "name": "logo", "type": "string", "optional": true }
  ],
  "exported": true
}
```

### analyze-stores.ts

Analyzes Zustand stores for state documentation.

```bash
npx ts-node scripts/analyze-stores.ts <directory> [--output <json-path>]
```

## Templates

### base-styles.css

Core CSS styles using BusinessConnect branding:
- Primary color: `#1E3A5F` (dark blue)
- Accent color: `#2980B9` (bright blue)
- Success: `#10B981`, Warning: `#F59E0B`, Error: `#EF4444`

Features:
- Professional typography
- Code syntax highlighting
- Table styling
- Component cards
- Print-optimized layout

### HTML Templates

- `component-doc.html` - Component documentation layout
- `architecture-doc.html` - Architecture overview layout
- `types-doc.html` - TypeScript reference layout

## Output Features

All generated PDFs include:
- Cover page with project name and generation date
- Clickable table of contents
- Syntax-highlighted code blocks
- Professional component cards
- Page numbers in footer
- French localization (default)

## Integration with BusinessConnect

This skill is configured for the BusinessConnect B2B matchmaking platform:

**Key directories to document:**
- `/src/components/ui/` - Shadcn/ui base components
- `/src/components/shared/` - ParticipantCard, ChatBot
- `/src/components/layout/` - Sidebar, Header, BottomNav
- `/src/pages/` - All 12 page components
- `/src/store/` - 6 Zustand stores
- `/src/types/` - Core TypeScript definitions

**Types to document:**
- `Participant`, `User`, `Meeting`, `TimeSlot`
- `Conversation`, `Message`, `EventInfo`, `ProgramItem`
- `Sector`, `StartupStage`, `PartnershipType` (union types)

## Troubleshooting

### Puppeteer Issues

If Puppeteer fails to launch:
```bash
# Install Chromium dependencies (Linux)
sudo apt-get install -y chromium-browser

# Or use puppeteer with bundled Chromium
npm install puppeteer
```

### TypeScript Compilation

Ensure TypeScript is available:
```bash
npm install --save-dev typescript ts-node @types/node
```

### Large Projects

For large codebases, increase Node memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npx ts-node scripts/generate-pdf.ts ...
```

## File References

- [Component Patterns](references/component-patterns.md) - Documentation patterns for React components
- [Architecture Guide](references/architecture-guide.md) - Architecture documentation templates
- [TypeScript Docs](references/typescript-docs.md) - TypeScript documentation best practices
