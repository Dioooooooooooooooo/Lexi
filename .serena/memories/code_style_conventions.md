# Code Style and Conventions

## Backend (NestJS/TypeScript)
**Configuration:**
- ESLint + Prettier for code formatting
- TypeScript with experimental decorators enabled
- Path mapping: `@/*` -> `./src/*`

**Key Style Rules:**
- `@typescript-eslint/no-explicit-any`: OFF (allows any type)
- `@typescript-eslint/no-floating-promises`: WARN
- `@typescript-eslint/no-unsafe-argument`: WARN
- Strict null checks: disabled
- No implicit any: disabled

**NestJS Conventions:**
- Use decorators for controllers, services, modules
- Dependency injection pattern
- Global validation pipes enabled
- Exception filters for error handling
- Swagger documentation with decorators

**File Structure:**
- Controllers in `src/modules/[module]/[module].controller.ts`
- Services in `src/modules/[module]/[module].service.ts`
- DTOs for request/response validation
- Global filters, decorators, validators in respective directories

## Frontend (React Native/Expo)
**Configuration:**
- TypeScript with strict mode enabled
- Tailwind CSS via NativeWind
- Path mapping: `@/*` -> `./*`, `~/*` -> `*`

**Key Technologies:**
- Expo Router for navigation
- React Query for data fetching
- Zustand for state management
- React Native primitives for UI components

**File Structure:**
- File-based routing in `app/` directory
- Components in `components/` directory
- Utilities in `utils/` directory
- Services in `services/` directory
- Models/types in `models/` directory
- Stores (Zustand) in `stores/` directory

**Naming Conventions:**
- PascalCase for components and types
- camelCase for functions and variables
- kebab-case for file names (following Expo conventions)

## General Conventions
- Use TypeScript throughout both projects
- Consistent error handling patterns
- Environment-specific configurations
- API-first design with Swagger documentation