# Architecture Documentation Guide

Templates and patterns for documenting project architecture.

## Architecture Overview Sections

### 1. Technology Stack

Document the core technologies:

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | React 18+ | UI library |
| Language | TypeScript | Type safety |
| Build | Vite | Fast development |
| Styling | TailwindCSS | Utility-first CSS |
| UI | Shadcn/ui | Component library |
| State | Zustand | State management |
| Routing | React Router v6 | Client-side routing |
| Icons | Lucide React | Icon library |

### 2. Directory Structure

```
src/
├── components/      # Reusable UI components
│   ├── ui/          # Shadcn/ui base components
│   ├── shared/      # Business components
│   └── layout/      # Layout components
├── pages/           # Page components (routes)
├── layouts/         # Layout wrappers
├── store/           # Zustand stores
├── hooks/           # Custom React hooks
├── types/           # TypeScript definitions
├── data/            # Mock data (MVP)
├── lib/             # Utility functions
└── App.tsx          # Root component with routing
```

### 3. Routing Architecture

Document route structure:

**Public Routes** (accessible without auth):
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

**Protected Routes** (require authentication):
- `/dashboard` - Main dashboard
- `/participants` - Participant list
- `/participants/:id` - Participant details
- `/preferences` - Meeting preferences
- `/agenda` - Personal agenda
- `/programme` - Event program
- `/messages` - Messaging
- `/infos-pratiques` - Practical info
- `/settings` - User settings

**Route Guards**:
- `ProtectedRoute` - Redirects to login if not authenticated
- `PublicRoute` - Redirects to dashboard if already authenticated

### 4. State Management

Document Zustand stores:

**authStore** - User authentication
- State: user, isAuthenticated, isLoading
- Actions: login, logout, register, updateProfile

**participantsStore** - Participant data
- State: participants, filters, favorites
- Actions: setFilter, toggleFavorite, searchParticipants

**preferencesStore** - Meeting preferences
- State: preferences, submitted
- Actions: addPreference, removePreference, reorder, submit

**agendaStore** - Schedule management
- State: meetings, timeSlots
- Actions: generateAgenda, exportICS

**messagesStore** - Messaging
- State: conversations, messages
- Actions: sendMessage, markAsRead

**chatbotStore** - Chatbot
- State: messages, isOpen
- Actions: sendMessage, toggle

### 5. Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │────▶│   Store     │────▶│ localStorage│
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │
      │  useStore()       │  persist()
      │                   │
      ▼                   ▼
┌─────────────┐     ┌─────────────┐
│    UI       │     │    Data     │
└─────────────┘     └─────────────┘
```

## Diagram Recommendations

Include these diagrams in architecture docs:

1. **Component Hierarchy** - Tree view of component relationships
2. **Route Structure** - Visual map of application routes
3. **State Flow** - Data flow between stores and components
4. **Data Model** - Entity relationships

## Performance Considerations

Document:

- Lazy loading strategy for routes
- Memoization patterns (useMemo, useCallback)
- Store selector patterns to prevent unnecessary renders
- Image optimization approach

## Security Considerations

Document:

- Authentication flow
- Route protection mechanisms
- Data validation patterns
- LocalStorage security considerations

## Scalability Notes

For future development:

- Backend integration points
- API structure expectations
- Multi-tenant considerations
- Internationalization readiness
