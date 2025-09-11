# TanStack Query Architecture Guide - A Comprehensive Approach

## 📋 Overview

**This document outlines a comprehensive architecture pattern for React Native applications using TanStack Query with generated OpenAPI clients.**

This approach emphasizes:

- Type safety through generated API clients
- Consistent server state management via TanStack Query
- Clear separation between server state and UI state
- Pragmatic authentication patterns

_Note: This represents one proven approach among several valid patterns in the React Native community._

## Core Principles

```
SERVER STATE → TanStack Query (with flexibility for auth)
CLIENT STATE → Stores (Zustand/Context)
API LAYER → Generated TypeScript clients
```

## Architecture Overview

### 1. Generated API Client Layer

**Location**: `mobile/hooks/api/`
**Files**: `services.gen.ts`, `types.gen.ts`, `schemas.gen.ts`
**Purpose**: Auto-generated TypeScript client from OpenAPI spec

**Key Guidelines**:

- Generated files should not be edited manually
- Import these only in TanStack Query hooks, not directly in components
- Provides type safety and consistency across the application

**Example**:

```typescript
// services.gen.ts - AUTO-GENERATED
export class AuthenticationService {
  static postAuthLogin(data: PostAuthLoginData) {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/login',
      body: data.requestBody,
    });
  }
}
```

### 2. TanStack Query Hooks Layer

**Location**: `mobile/hooks/`
**Purpose**: Wraps API calls with TanStack Query for server state management
**Structure**:

```
mobile/hooks/
├── api/                    # Generated client
│   ├── services.gen.ts
│   ├── types.gen.ts
│   └── schemas.gen.ts
├── mutation/               # POST/PUT/PATCH/DELETE operations
│   ├── useAuthMutations.ts
│   ├── useClassroomMutations.ts
│   └── usePupilMutations.ts
├── query/                  # GET operations
│   ├── useAuthQueries.ts
│   ├── useClassroomQueries.ts
│   └── usePupilQueries.ts
└── utils/                  # Transformers and helpers
    └── authTransformers.ts
```

## Authentication Patterns

### Recommended Hybrid Approach

The most commonly adopted pattern combines TanStack Query mutations with lightweight state management:

```typescript
// TanStack Query mutation handles token storage directly
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginDto) =>
      AuthenticationService.postAuthLogin({ requestBody: credentials }),

    onSuccess: async response => {
      // Token management handled directly in mutation
      await AsyncStorage.setItem('access_token', response.access_token);
      OpenAPI.TOKEN = response.access_token;

      // Update query cache
      if (response.user) {
        queryClient.setQueryData(['user'], response.user);
      } else {
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    },
  });
};

// Auth Store only for complex OAuth flows and global state
const useAuthStore = create((set, get) => ({
  providerAuth: async (provider: number) => {
    // Complex OAuth logic that hooks can't handle well
    // Google/Facebook SDK calls + token exchange
  },
}));
```

### Alternative Pure TanStack Query Approach

For teams preferring minimal dependencies:

```typescript
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginDto) =>
      AuthenticationService.postAuthLogin({ requestBody: credentials }),

    onSuccess: async response => {
      // All token management in the hook
      await AsyncStorage.setItem('access_token', response.access_token);
      OpenAPI.TOKEN = response.access_token;

      // Update query cache
      if (response.user) {
        queryClient.setQueryData(['user'], response.user);
      } else {
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    },
  });
};
```

## Mutation Best Practices

### Single Responsibility Principle

Each mutation should focus on one primary operation:

**✅ Recommended**:

```typescript
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginDto) =>
      AuthenticationService.postAuthLogin({ requestBody: credentials }),

    onSuccess: async response => {
      // Handle side effects in callback
      await AsyncStorage.setItem('access_token', response.access_token);
      OpenAPI.TOKEN = response.access_token;
    },
  });
};
```

**❌ Avoid**:

```typescript
// Multiple unrelated API calls in one mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: async credentials => {
      const loginResponse = await AuthenticationService.postAuthLogin(
        credentials,
      );
      const userResponse = await AuthenticationService.getAuthMe();
      return { ...loginResponse, user: userResponse };
    },
  });
};
```

### Handling Related Data

**Option 1: Backend Returns Complete Data** (Preferred)

```typescript
onSuccess: response => {
  // Backend includes user data in login response
  queryClient.setQueryData(['user'], response.user);
};
```

**Option 2: Invalidate Related Queries**

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['user'] });
};
```

**Option 3: Component-Level Orchestration**

```typescript
function LoginScreen() {
  const loginMutation = useLogin();
  const { refetch: refetchUser } = useCurrentUser();

  const handleLogin = async credentials => {
    await loginMutation.mutateAsync(credentials);
    await refetchUser();
  };
}
```

## State Management Guidelines

### What Goes Where

**TanStack Query** (Server State):

- API responses and cached data
- Server-side user information
- Remote data synchronization
- **Token storage and management** (handled in mutation callbacks)

**Stores/Context** (Client State):

- Complex authentication flows (OAuth)
- UI state (modals, themes, navigation)
- App preferences and settings
- Form state and temporary data
- Feature-specific client state

## Component Implementation Patterns

### Recommended Component Pattern

```typescript
// app/(auth)/signin.tsx
import { useLogin } from '@/hooks/mutation/useAuthMutations';
import { useCurrentUser } from '@/hooks/query/useAuthQueries';
import { useAuthStore } from '@/stores/authStore';

function LoginScreen() {
  const loginMutation = useLogin();
  const { data: user } = useCurrentUser();
  const providerAuth = useAuthStore(state => state.providerAuth);

  const handleLogin = formData => {
    loginMutation.mutate(formData, {
      onSuccess: () => {
        router.replace('/home');
      },
      onError: error => {
        console.error('Login failed:', error);
      },
    });
  };

  return (
    <Button onPress={handleLogin} disabled={loginMutation.isPending}>
      {loginMutation.isPending ? 'Logging in...' : 'Login'}
    </Button>
  );
}
```

## Query Client Configuration

```typescript
// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

## Common Patterns

### Dependent Queries

```typescript
const { data: user } = useCurrentUser();
const { data: posts } = usePosts({
  userId: user?.id,
  enabled: !!user?.id,
});
```

### Optimistic Updates

```typescript
const updateMutation = useMutation({
  mutationFn: updateProfile,
  onMutate: async newData => {
    await queryClient.cancelQueries({ queryKey: ['user'] });
    const previousData = queryClient.getQueryData(['user']);
    queryClient.setQueryData(['user'], newData);
    return { previousData };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['user'], context.previousData);
  },
});
```

### Cache Invalidation

```typescript
const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});
```

## Actual Project Structure

```
mobile/
├── app/                  # Expo Router - screens and layouts
│   ├── (auth)/          # Auth flow screens
│   ├── (tabs)/          # Tab navigation
│   └── _layout.tsx      # Root layout
├── hooks/
│   ├── api/             # Generated client
│   │   └── *.gen.ts
│   ├── mutation/        # Mutation hooks
│   ├── query/          # Query hooks
│   └── utils/          # Helpers
├── stores/             # Client state management (multiple stores)
│   ├── authStore.ts    # OAuth flows + auth state
│   ├── globalStore.ts  # Global UI state
│   ├── userStore.ts    # User preferences
│   └── ...Store.ts     # Feature-specific stores
├── components/         # Reusable components
└── utils/             # Utility functions
```

## Migration Checklist

When adopting this architecture:

### Implementation Steps:

- [ ] Set up generated API client from OpenAPI spec
- [ ] Create TanStack Query hooks for all API operations
- [ ] Implement stores for complex flows and UI state
- [ ] Update components to use hooks instead of direct API calls
- [ ] Configure Query Client with appropriate defaults
- [ ] Handle token storage in mutation callbacks (AsyncStorage)

### Validation Questions:

- Are all server operations going through TanStack Query hooks?
- Is token management handled in mutation callbacks?
- Are stores used only for complex flows and UI state?
- Do mutations follow single responsibility principle?
- Is error handling implemented consistently across the app?

## Benefits of This Approach

- **Type Safety**: Generated clients ensure API consistency
- **Performance**: TanStack Query provides caching and background updates
- **Developer Experience**: Consistent patterns and excellent debugging tools
- **Flexibility**: Works with various authentication strategies
- **Scalability**: Clear separation of concerns as the app grows
- **Token Management**: Handled automatically in mutation callbacks

## Alternative Approaches

This pattern works well for medium-to-large applications with complex APIs. Consider alternatives for:

- **Simple apps**: Direct fetch/axios might be sufficient
- **GraphQL APIs**: Apollo Client or urql might be more appropriate
- **Real-time heavy**: Consider WebSocket-first approaches
- **Offline-first**: Additional persistence strategies needed

## Final Notes

This architecture has been successfully implemented in the Babolat React Native application. The key insight is that **token management can be handled directly in TanStack Query mutation callbacks**, reducing complexity while maintaining security and consistency.

Teams should adapt these patterns based on their specific requirements, team size, and application complexity. The key is maintaining consistency in whatever pattern you choose and ensuring clear separation between server state, client state, and UI concerns.
