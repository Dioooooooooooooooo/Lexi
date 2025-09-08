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
- **Mobile**: Expo Router pages (`app/`), components, hooks, stores (UI only)
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

### API Development Pattern (CORRECT)
1. Write NestJS endpoint with Swagger decorators
2. `pnpm openapi:spec` - Generate spec from backend
3. `pnpm openapi:client` - Generate TypeScript client in `mobile/hooks/api/`
4. Create TanStack Query hooks wrapping generated client
5. Use hooks directly in components (NEVER call services directly)

### Before Committing (MANDATORY)
```bash
pnpm lint               # Must pass
pnpm test               # Must pass
pnpm build              # Must compile
```

## TanStack Query Architecture (DEFINITIVE)

### ⚠️ CRITICAL: ALL Server State Through TanStack Query
- **EVERY** API call uses TanStack Query mutations or queries
- **NO** direct service imports in components
- **NO** API calls in stores
- Stores handle **UI state ONLY**

### Correct Structure
```
mobile/hooks/
├── api/                         # AUTO-GENERATED (NEVER EDIT)
│   ├── services.gen.ts         # Generated API client
│   ├── types.gen.ts           # Generated TypeScript types
│   └── schemas.gen.ts         # Generated schemas
├── mutation/                   # ALL POST/PUT/PATCH/DELETE
│   ├── useAuthMutations.ts   # Login, signup, logout
│   └── useClassroomMutations.ts
├── query/                      # ALL GET operations
│   ├── useAuthQueries.ts     # User profile, verification
│   └── useClassroomQueries.ts
└── utils/
    └── authTransformers.ts    # camelCase ↔ snake_case

mobile/stores/                  # UI STATE ONLY
├── uiStore.ts                 # Theme, modals, sidebar
└── globalStore.ts             # Loading states, UI preferences
```

### Data Transformation Pattern
- **UI Forms**: camelCase (`firstName`, `confirmPassword`)
- **API Expects**: snake_case (`first_name`, `confirm_password`)
- **Solution**: Transform in mutation/query hooks before API calls

### Import Patterns (CORRECT)
```typescript
// ✅ CORRECT - Import hooks
import { useLogin, useSignup } from '@/hooks';
import { useCurrentUser } from '@/hooks/query/useAuthQueries';

// ❌ WRONG - Never import services directly
import { AuthService } from '@/services/AuthService'; // DELETE THIS
import { AuthenticationService } from '@/hooks/api/services.gen'; // NEVER IN COMPONENTS
```

### Component Pattern (ONLY WAY)
```typescript
// ✅ CORRECT
function LoginScreen() {
  const loginMutation = useLogin();
  
  const handleLogin = (formData) => {
    loginMutation.mutate(formData, {
      onSuccess: () => router.replace('/home')
    });
  };
  
  return (
    <Button onPress={handleLogin} disabled={loginMutation.isPending}>
      {loginMutation.isPending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

// ❌ WRONG - Never use stores for API
const authStore = useAuthStore();
authStore.login(credentials); // NEVER DO THIS
```

## Task Completion Checklist

### ✅ Every Code Task Must:
1. **Pass linting**: `pnpm lint`
2. **Pass tests**: `pnpm test` 
3. **Build successfully**: `pnpm build`
4. **Follow TanStack Query patterns**: ALL server ops through hooks
5. **Regenerate API** (if backend changed): `pnpm openapi:docs`

### ✅ Architecture Checks:
- Components ONLY import hooks, never services
- Stores NEVER make API calls
- Every API operation has a corresponding hook
- Authentication uses mutations, not stores
- Token storage in mutation callbacks

## Git & Commits
- **Format**: Conventional commits (`feat:`, `fix:`, `docs:`)
- **Scope**: Include module when relevant
- **Branches**: `feature/`, `fix/`, `docs/`, `refactor/`

## Migration from Old Architecture
If you see:
- `mobile/services/` folder → DELETE IT
- `authStore.login()` → Replace with `useLogin()` mutation
- Direct service imports → Replace with hook imports
- API calls in stores → Move to TanStack Query hooks