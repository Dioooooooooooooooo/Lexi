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

## Hook Architecture (Updated)

### New TanStack Query Structure
```
mobile/hooks/
├── api/
│   ├── requests/        # Auto-generated OpenAPI client
│   └── apiUtils.ts      # Query keys and auth setup
├── mutation/
│   ├── useAuthMutations.ts     # Login, register, logout
│   ├── useClassroomMutations.ts # Create, update, delete
│   ├── useMinigameMutations.ts  # Log completions
│   └── usePupilMutations.ts     # Profile updates
├── query/
│   ├── useAuthQueries.ts        # Profile, token verification
│   ├── useClassroomQueries.ts   # List, detail queries
│   ├── useMinigameQueries.ts    # Random minigames
│   └── usePupilQueries.ts       # Leaderboard, user lookup
├── utils/
│   └── authTransformers.ts      # UI ↔ API data transformation
└── index.ts                     # Centralized exports
```

### Data Transformation Pattern
- **UI Forms**: camelCase (`firstName`, `lastName`, `confirmPassword`)
- **API Expects**: snake_case (`first_name`, `last_name`, `confirm_password`)
- **Solution**: Transform in utils before API calls

### Import Patterns
```typescript
// New centralized imports
import { useRegister, useLogin } from '@/hooks';
import { useClassrooms, useCreateClassroom } from '@/hooks';
import { usePupilMe, useUpdatePupilProfile } from '@/hooks';

// Data transformation (internal use)
import { transformRegistrationData } from '@/hooks/utils/authTransformers';
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
- Follow TanStack Query patterns (separate query/mutation files)

## Git & Commits
- **Format**: Conventional commits (`feat:`, `fix:`, `docs:`)
- **Scope**: Include module when relevant
- **Branches**: `feature/`, `fix/`, `docs/`, `refactor/`
- **Migration**: Update `API_MIGRATION_PROGRESS.md` when applicable