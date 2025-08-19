# Architecture and Design Patterns

## Mobile App Architecture (React Native + Expo)

### File-Based Routing (Expo Router)
- Routes defined by file structure in `app/` directory
- Layout files: `_layout.tsx` for nested layouts
- Route groups: `(auth)`, `(tabs)`, `(minigames)` for organization
- Dynamic routes: `[id].tsx` for parameterized pages

### State Management
- **Zustand**: Lightweight state management in `stores/`
- **TanStack Query**: Server state and caching for API calls
- **Context**: React Context for theme and global state

### Component Architecture
- **UI Components**: Reusable components in `components/ui/`
- **Feature Components**: Feature-specific components in `components/`
- **Variants**: Class Variance Authority (CVA) for component variants
- **Composition**: Compound components with slot patterns

### Styling System
- **NativeWind**: Tailwind CSS for React Native styling
- **Design System**: Custom colors, spacing, typography in tailwind.config.js
- **Theme Support**: Light/dark mode with CSS custom properties
- **Responsive**: Platform-specific styles with web/ios/android modifiers

## Backend Architecture (NestJS)

### Module Structure
```
src/
├── app/              # Feature modules
│   ├── auth/         # Authentication
│   ├── classrooms/   # Classroom management
│   ├── minigames/    # Game logic
│   └── pupils/       # User management
├── common/           # Shared utilities
├── database/         # Database configuration
├── decorators/       # Custom decorators
├── filters/          # Exception filters
└── validators/       # Custom validators
```

### Design Patterns
- **Repository Pattern**: Database access abstraction
- **Service Layer**: Business logic separation
- **DTO Pattern**: Data transfer objects with validation
- **Guard Pattern**: Authentication and authorization
- **Interceptor Pattern**: Request/response transformation

### Database Integration
- **Kysely**: Type-safe SQL query builder
- **Code Generation**: Auto-generated types from database schema
- **Migrations**: Database schema versioning

## API Integration

### OpenAPI Workflow
1. Backend generates OpenAPI spec via Swagger
2. Frontend downloads spec: `pnpm run openapi:spec`
3. Auto-generate TanStack Query hooks: `pnpm run openapi:client`
4. Type-safe API calls with React hooks

### Error Handling
- **Backend**: Exception filters for consistent error responses
- **Frontend**: React Query error boundaries and toast notifications

## Development Patterns

### Monorepo Structure
- **pnpm Workspaces**: Shared dependencies and scripts
- **Cross-package**: Backend changes trigger frontend regeneration
- **Unified Tooling**: Shared linting, formatting, TypeScript config

### Code Generation
- **API Client**: Automatic React Query hook generation
- **Database Types**: Kysely schema generation
- **OpenAPI**: Swagger decorators for documentation

### Testing Strategy
- **Unit Tests**: Jest for both frontend and backend
- **E2E Tests**: Backend integration tests
- **Manual Testing**: Mobile app testing on multiple platforms