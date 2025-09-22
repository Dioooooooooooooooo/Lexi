# API Hooks Architecture

## Overview
The mobile app uses a **decoupled hook architecture** with auto-generated TypeScript client and modular TanStack Query hooks organized by service domain.

## Hook Structure

```
mobile/hooks/
├── api/
│   ├── apiUtils.ts       # Shared config & query keys
│   └── requests/         # Auto-generated API client
│       ├── client.gen.ts # Generated client
│       ├── types.gen.ts  # Generated TypeScript types
│       └── core/         # HTTP client infrastructure
├── mutation/
│   ├── useAuthMutations.ts      # Authentication mutations
│   ├── useClassroomMutations.ts # Classroom mutations
│   └── useMinigameMutations.ts  # Minigame mutations
├── query/
│   ├── useAuthQueries.ts        # Authentication queries
│   ├── useClassroomQueries.ts   # Classroom queries
│   └── useMinigameQueries.ts    # Minigame queries
└── index.ts             # Barrel exports
```

## Generated Client Integration

### Workflow
1. **Backend**: NestJS endpoints with Swagger decorators
2. **Generation**: `pnpm openapi:spec` → `pnpm openapi:client`
3. **Hooks**: Modular TanStack Query hooks wrap generated services
4. **Components**: Import and use specific hooks

### Example Usage
```typescript
// Import specific hooks
import { useLogin, useAuthMe } from '@/hooks/mutation/useAuthMutations';
import { useClassrooms } from '@/hooks/query/useClassroomQueries';

// Or use barrel imports
import { useLogin, useClassrooms } from '@/hooks';

// In components
const LoginScreen = () => {
  const { mutate: login, isLoading } = useLogin();
  const handleLogin = (credentials) => login(credentials);

  return (
    <Button onPress={handleLogin} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login'}
    </Button>
  );
};
```

## Hook Categories

### 🔐 Authentication (`useAuthHooks.ts`)
- `useAuthMe()` - Get current user profile
- `useVerifyToken()` - Validate JWT token
- `useLogin()` - User login mutation
- `useRegister()` - User registration mutation
- `useLogout()` - User logout mutation
- `useRefreshToken()` - JWT refresh mutation
- `useUpdateProfile()` - Profile update mutation
- `useChangePassword()` - Password change mutation

### 👨‍🎓 Students (`usePupilsHooks.ts`)
- `usePupilMe()` - Get student profile
- `useUpdatePupilProfile()` - Update student profile
- `usePupilsLeaderboard()` - Get leaderboard data
- `usePupilLeaderboardById()` - Get specific student rank
- `usePupilByUsername()` - Find student by username

### 🏫 Classrooms (`useClassroomsHooks.ts`)
- `useClassrooms()` - List all classrooms
- `useClassroomById()` - Get specific classroom
- `useCreateClassroom()` - Create new classroom
- `useUpdateClassroom()` - Update classroom details
- `useDeleteClassroom()` - Delete classroom

### 🎮 Minigames (`useMinigamesHooks.ts`)
- `useRandomMinigamesByMaterial()` - Get games for material
- `useRandomMinigamesBySession()` - Get games for session
- `useWordsFromLettersMinigame()` - Specific game type
- `useCompleteMinigameSession()` - Mark session complete
- `useCreateSentenceRearrangementLog()` - Log game results
- `useCreateChoicesLog()` - Log choice-based game results
- `useCreateWordsFromLettersLog()` - Log word game results

## Shared Utilities (`apiUtils.ts`)

### Authentication Management
```typescript
// Auto token setup from AsyncStorage
await setupAuthToken();

// Manual token configuration
const { setToken, getConfig } = useConfigureAuth();
setToken(newToken);
```

### Query Key Factory
```typescript
// Organized query keys for cache management
const queryKeys = {
  auth: {
    all: ['auth'],
    me: () => ['auth', 'me'],
    // ...
  },
  pupils: { /* ... */ },
  classrooms: { /* ... */ },
  minigames: { /* ... */ },
};
```

## Cache Management

### Automatic Invalidation
```typescript
// Mutations automatically invalidate related queries
const { mutate: createClassroom } = useCreateClassroom();
// ↑ Automatically invalidates useClassrooms() cache

const { mutate: login } = useLogin();
// ↑ Automatically invalidates useAuthMe() cache
```

### Manual Cache Updates
```typescript
// Direct cache updates for better UX
onSuccess: (data, variables) => {
  // Update specific item in cache
  queryClient.setQueryData(
    queryKeys.classrooms.detail(variables.id), 
    data
  );
  // Invalidate list views
  queryClient.invalidateQueries({ 
    queryKey: queryKeys.classrooms.list() 
  });
}
```

## Error Handling

### Consistent Error Patterns
```typescript
// All hooks include standardized error handling
const { mutate: login, error, isError } = useLogin();

// Automatic retry logic for network issues
retry: (failureCount, error) => {
  if (error?.status === 401) return false; // Don't retry auth errors
  return failureCount < 3; // Retry network errors
}
```

### Global Error Boundaries
```typescript
// Errors bubble up to React Error Boundaries
// Network failures handled gracefully
// 401 errors trigger automatic logout flow
```

## Migration Status

### ✅ Completed (Updated 2025-01-12)
- Hook architecture implemented and organized
- All authentication flows migrated
- Complete classroom management
- Full student/pupil functionality  
- All minigame operations (including new creation hooks)
- **NEW:** Server health monitoring hooks
- **NEW:** Achievements system hooks (get/add/remove pupil achievements)
- **NEW:** Activities management hooks (classroom activities CRUD)
- **NEW:** User profile hooks (streaks, sessions, search)
- **NEW:** Activity logging hooks
- **NEW:** Dictionary lookup hooks
- **NEW:** Reading sessions management (full CRUD)
- **NEW:** Reading materials + recommendations hooks
- **NEW:** Genre management hooks
- Comprehensive error handling
- Automatic cache invalidation
- Type-safe end-to-end

### 📝 Integration Points
Hooks are ready for UI integration. Components should replace manual API calls with these hooks following the import patterns above.

## Performance Optimizations

### Smart Caching
- **Auth data**: 5-minute stale time
- **Classrooms**: 2-minute stale time  
- **Leaderboards**: 1-minute stale time
- **Games**: 5-minute stale time

### Background Updates
- Automatic background refetch
- Optimistic updates for mutations
- Intelligent retry strategies
- Minimal network requests