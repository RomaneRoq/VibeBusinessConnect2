# TypeScript Documentation Guide

Best practices for documenting TypeScript types in technical documentation.

## Type Categories

### 1. Interfaces

Use interfaces for object shapes that may be extended:

```typescript
interface Participant {
  id: string;
  type: ParticipantType;
  name: string;
  // ...
}
```

**Documentation should include:**
- Purpose of the interface
- All properties with types
- Required vs optional properties
- Related interfaces

### 2. Type Aliases

Use type aliases for unions, intersections, and complex types:

```typescript
type ParticipantType = 'startup' | 'enterprise';
type Sector = 'fintech' | 'regtech' | 'insurtech' | ...;
```

**Documentation should include:**
- All possible values
- When to use each value
- Related constants (labels)

### 3. Enums

Use enums sparingly, prefer union types:

```typescript
enum Status {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}
```

### 4. Constants

Document constant objects that map values to labels:

```typescript
const SECTOR_LABELS: Record<Sector, string> = {
  fintech: 'Fintech',
  regtech: 'Regtech',
  // ...
};
```

## Documentation Format

### Interface Documentation

```markdown
## Participant

Represents a participant in the event (startup or enterprise).

**File**: `src/types/index.ts`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| type | ParticipantType | Yes | 'startup' or 'enterprise' |
| name | string | Yes | Company name |
| logo | string | No | URL to company logo |
| sector | Sector | Yes | Business sector |
| pitch | string | Yes | Short pitch (1-2 sentences) |
| description | string | Yes | Full description |
| email | string | Yes | Contact email |
| website | string | No | Company website URL |
| linkedIn | string | No | LinkedIn profile URL |
| lookingFor | PartnershipType[] | Yes | Types of partnerships sought |
| thematicsInterest | string[] | Yes | Topics of interest |

### Startup-specific properties

| Property | Type | Description |
|----------|------|-------------|
| stage | StartupStage | Current funding stage |
| fundingRaised | string | Amount raised |
| teamSize | number | Number of employees |
| foundedYear | number | Year founded |

### Enterprise-specific properties

| Property | Type | Description |
|----------|------|-------------|
| employeeCount | string | Employee count range |
| annualRevenue | string | Revenue range |
| innovationBudget | string | Innovation budget |
| resources | string[] | Available resources |
```

### Union Type Documentation

```markdown
## Sector

Business sector classification for participants.

**File**: `src/types/index.ts`

**Values:**

| Value | Label | Description |
|-------|-------|-------------|
| fintech | Fintech | Financial technology |
| regtech | Regtech | Regulatory technology |
| insurtech | Insurtech | Insurance technology |
| blockchain | Blockchain | Blockchain & DLT |
| cybersecurity | Cybersecurite | Cybersecurity solutions |
| ai_ml | IA & Machine Learning | AI and ML solutions |
| payments | Paiements | Payment solutions |
| banking | Banque | Banking services |
| compliance | Conformite | Compliance solutions |
| data_analytics | Data Analytics | Data analysis tools |

**Related constant**: `SECTOR_LABELS`
```

## Type Relationships

Document how types relate to each other:

```markdown
## Type Relationships

```
Participant
├── type: ParticipantType
├── sector: Sector
├── stage?: StartupStage (if startup)
└── lookingFor: PartnershipType[]

User
└── participant: Participant

Meeting
└── participant: Participant

Conversation
└── participant: Participant
```
```

## Utility Types

Document utility types used in the project:

```markdown
## Utility Types

### SectorLabel
Maps Sector values to display labels.

```typescript
type SectorLabel = {
  [key in Sector]: string;
};
```

### StageLabel
Maps StartupStage values to display labels.

```typescript
type StageLabel = {
  [key in StartupStage]: string;
};
```
```

## Best Practices

1. **Use JSDoc comments** for inline documentation
2. **Export all public types** from a central index.ts
3. **Use strict TypeScript** (no 'any')
4. **Prefer interfaces** for extensible object types
5. **Use union types** instead of enums when possible
6. **Document optional vs required** properties clearly
7. **Include usage examples** for complex types

## Example JSDoc

```typescript
/**
 * Represents a participant in the B2B event.
 * Can be either a startup or an established enterprise.
 *
 * @example
 * const startup: Participant = {
 *   id: '1',
 *   type: 'startup',
 *   name: 'FinTech Solutions',
 *   sector: 'fintech',
 *   // ...
 * };
 */
export interface Participant {
  /** Unique identifier for the participant */
  id: string;

  /** Type of participant */
  type: ParticipantType;

  // ...
}
```
