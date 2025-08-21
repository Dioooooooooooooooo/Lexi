# Development Guide

## Code Style & Conventions

### Formatting (Prettier)
- Trailing commas: always
- Tab width: 2 spaces  
- Semicolons: required
- Quotes: double quotes
- Print width: 80 chars

### File Structure
- **Backend**: Feature modules (`auth/`, `classrooms/`, `pupils/`, `minigames/`)
- **Mobile**: Expo Router pages (`app/`), components, hooks, stores
- **Naming**: kebab-case files, PascalCase classes, camelCase functions

### TypeScript Rules
- No explicit `any` (error level)
- No floating promises (warning)
- Strict mode enabled

## Daily Workflow

### Start Development
```bash
pnpm dev                 # Start everything
pnpm dev:backend         # NestJS only
pnpm dev:mobile         # Expo only
```

### API Development Pattern
1. Write NestJS endpoint with Swagger decorators
2. `pnpm openapi:spec` - Generate spec from backend
3. `pnpm openapi:client` - Generate TypeScript client
4. Use generated TanStack Query hooks in components

### Before Committing (MANDATORY)
```bash
pnpm lint               # Must pass
pnpm test               # Must pass
pnpm build              # Must compile
```

## Task Completion Checklist

### ✅ Every Code Task Must:
1. **Pass linting**: `pnpm lint`
2. **Pass tests**: `pnpm test` 
3. **Build successfully**: `pnpm build`
4. **Regenerate API** (if backend changed): `pnpm openapi:docs`

### ✅ Additional Checks:
- All endpoints have Swagger documentation
- Components follow NativeWind styling
- Error states handled gracefully
- TypeScript strict compliance
- No console.log in production code

## Git & Commits
- **Format**: Conventional commits (`feat:`, `fix:`, `docs:`)
- **Scope**: Include module when relevant
- **Branches**: `feature/`, `fix/`, `docs/`, `refactor/`
- **Migration**: Update `API_MIGRATION_PROGRESS.md` when applicable

## Import Patterns
```typescript
// Backend - absolute imports
import { AuthService } from '@/app/auth/auth.service';

// Mobile - generated hooks
import { useLogin, useAuthMe } from '@/lib/hooks/useAuthHooks';
import { useClassrooms } from '@/lib/hooks/useClassroomsHooks';
```