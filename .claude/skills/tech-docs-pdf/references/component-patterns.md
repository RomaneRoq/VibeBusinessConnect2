# Component Documentation Patterns

This reference provides patterns for documenting React components in technical documentation.

## Component Categories

### UI Components (Shadcn/ui)
Located in `/src/components/ui/`. These are base building blocks:
- Button, Card, Input, Badge, Dialog, etc.
- Document: variant options, size options, accessibility features

### Shared Components
Located in `/src/components/shared/`. Reusable business components:
- ParticipantCard, ChatBot
- Document: props, integration with stores, usage examples

### Layout Components
Located in `/src/components/layout/`. Structural components:
- Sidebar, Header, BottomNav
- Document: responsive behavior, navigation structure

### Page Components
Located in `/src/pages/`. Full page implementations:
- Dashboard, Participants, Agenda, etc.
- Document: route, data dependencies, child components

## Documentation Template

For each component, include:

1. **Overview**: Brief description of purpose
2. **Location**: File path relative to src/
3. **Props Table**: Name, type, required/optional, default, description
4. **Dependencies**: Imports from stores, hooks, other components
5. **Usage Example**: Code snippet showing typical usage
6. **Styling**: TailwindCSS classes used, theming considerations
7. **Accessibility**: ARIA attributes, keyboard navigation

## Props Documentation Format

```typescript
interface ComponentProps {
  /** Description of the prop */
  propName: PropType;

  /** Optional prop with default */
  optionalProp?: string;
}
```

## Code Snippet Best Practices

- Show minimal working example
- Include necessary imports
- Demonstrate common use cases
- Use project conventions (French text for user-facing content)

## Example Component Documentation

### ParticipantCard

**Overview**: Displays a participant's information in a card format with actions.

**Location**: `src/components/shared/ParticipantCard.tsx`

**Props**:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| participant | Participant | Yes | The participant data to display |
| showActions | boolean | No | Whether to show action buttons |
| onFavorite | () => void | No | Callback when favorite is toggled |

**Usage**:

```tsx
import { ParticipantCard } from '@/components/shared/ParticipantCard';

function ParticipantList() {
  return (
    <div className="grid gap-4">
      {participants.map(p => (
        <ParticipantCard
          key={p.id}
          participant={p}
          showActions
        />
      ))}
    </div>
  );
}
```

## Hooks Documentation

When a component uses hooks, document:

- Which hooks are used
- What state they manage
- Side effects they trigger

Example:

```markdown
### Hooks Used

- `useState` - Manages local loading state
- `useNavigate` - Navigation to participant details
- `useParticipantsStore` - Access to favorites functionality
```

## Styling Guidelines

Document TailwindCSS patterns used:

- Layout classes (flex, grid, spacing)
- Responsive breakpoints (sm:, md:, lg:)
- Theme-aware classes (dark: variants if applicable)
- Custom utility classes from index.css

## Accessibility Checklist

For each component, verify:

- [ ] Proper ARIA labels
- [ ] Keyboard navigation support
- [ ] Focus management
- [ ] Color contrast (WCAG 2.1 AA)
- [ ] Screen reader compatibility
