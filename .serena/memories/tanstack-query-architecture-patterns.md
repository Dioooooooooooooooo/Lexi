# TanStack Query Architecture - Definitive Guide

## ⚠️ CRITICAL: Read This First

**This document defines the ONLY correct architecture for React Native with TanStack Query.**

- There are NO exceptions to these patterns
- ALL server operations use TanStack Query (including authentication)
- Stores NEVER call API services directly
- The old `mobile/services/` folder should NOT exist

## Core Principle: Complete Separation

```
SERVER STATE → TanStack Query ONLY
CLIENT STATE → Stores (Zustand/MobX) ONLY
```

## The ONLY Correct Architecture

### 1. API Client Layer (Generated)

**Location**: `mobile/hooks/api/`
**Files**: `services.gen.ts`, `types.gen.ts`, `schemas.gen.ts`
**Purpose**: Auto-generated TypeScript client from OpenAPI spec
**Key Rules**:

- NEVER edit these files manually
- NEVER import these directly in components
- ONLY imported by TanStack Query hooks

**Example**:

```typescript
// services.gen.ts - AUTO-GENERATED, DO NOT EDIT
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

### 2. TanStack Query Hooks Layer (ALL Server Operations)

**Location**: `mobile/hooks/`
**Purpose**: Wraps EVERY API call with TanStack Query
**Structure**:

```
mobile/hooks/
├── api/                    # Generated client (DO NOT EDIT)
│   ├── services.gen.ts
│   ├── types.gen.ts
│   └── schemas.gen.ts
├── mutation/               # ALL POST/PUT/PATCH/DELETE operations
│   ├── useLoginMutation.ts
│   ├── useSignupMutation.ts
│   ├── useLogoutMutation.ts
│   ├── useUpdateProfileMutation.ts
│   └── useCreatePostMutation.ts
├── query/                  # ALL GET operations
│   ├── useCurrentUser.ts
│   ├── usePosts.ts
│   └── useProfile.ts
└── utils/                  # Transformers and helpers
    └── authTransformers.ts
```

**MANDATORY: Every API call MUST go through these hooks**

#### Example Mutation (Authentication)

```typescript
// hooks/mutation/useLoginMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthenticationService } from '../api/services.gen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginDto) =>
      AuthenticationService.postAuthLogin({ requestBody: credentials }),

    onSuccess: async response => {
      // Store tokens
      await AsyncStorage.setItem('access_token', response.access_token);
      await AsyncStorage.setItem('refresh_token', response.refresh_token);

      // Update query cache
      queryClient.setQueryData(['user'], response.user);

      // Navigate
      router.replace('/home');
    },

    onError: error => {
      // Error handling
      Toast.show({ type: 'error', text1: error.message });
    },
  });
};
```

#### Example Query

```typescript
// hooks/query/useCurrentUser.ts
import { useQuery } from '@tanstack/react-query';
import { AuthenticationService } from '../api/services.gen';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => AuthenticationService.getAuthMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### 3. Stores Layer (Client UI State ONLY)

**Location**: `mobile/stores/`
**Purpose**: ONLY client-side UI state that never touches the server

**What Stores ARE For**:

- **UI toggles**: sidebar open/closed, modal visibility, dropdown states
- **Theme/appearance**: dark/light mode, font size, language
- **Temporary form data**: drafts before submission, multi-step form progress
- **Local preferences**: sound on/off, recent searches, favorite filters
- **Navigation state**: active tab, scroll position, breadcrumbs

**What Stores are NOT For**:

- ❌ ANY API calls or service imports
- ❌ User data (use TanStack Query cache)
- ❌ Authentication state (use TanStack Query cache)
- ❌ Posts/content from API (use TanStack Query cache)
- ❌ Login/logout/signup functions (use mutations)
- ❌ Token management (handle in mutation callbacks)

**Simple Rule**: If it comes from or goes to the server → TanStack Query. If it's purely UI → Store.

**Example UI Store**:

```typescript
// stores/uiStore.ts
import { create } from 'zustand';

interface UIStore {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activeModal: string | null;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setActiveModal: (modal: string | null) => void;
}

export const useUIStore = create<UIStore>(set => ({
  theme: 'light',
  sidebarOpen: false,
  activeModal: null,

  toggleTheme: () =>
    set(state => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),

  toggleSidebar: () =>
    set(state => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setActiveModal: modal => set({ activeModal: modal }),
}));
```

## Component Pattern (The ONLY Way)

### ✅ CORRECT Implementation

```typescript
// screens/LoginScreen.tsx
import { useLoginMutation } from '@/hooks/mutation/useLoginMutation';

function LoginScreen() {
  const loginMutation = useLoginMutation();

  const handleLogin = formData => {
    // Components ONLY call TanStack Query hooks
    loginMutation.mutate(formData);
  };

  return (
    <Button onPress={handleLogin} disabled={loginMutation.isPending}>
      {loginMutation.isPending ? 'Logging in...' : 'Login'}
    </Button>
  );
}
```

### ❌ WRONG Implementations (NEVER DO THESE)

```typescript
// WRONG: Calling store for API operations
const authStore = useAuthStore();
authStore.login(credentials); // ❌ NEVER

// WRONG: Importing services directly
import { AuthService } from '@/services/AuthService'; // ❌ This folder shouldn't exist
AuthService.login(credentials); // ❌ NEVER

// WRONG: Importing generated client directly
import { AuthenticationService } from '@/hooks/api/services.gen';
AuthenticationService.postAuthLogin(data); // ❌ NEVER in components
```

## Migration Checklist

If migrating from old architecture:

### Delete These Files/Folders:

- [ ] `mobile/services/` - ENTIRE FOLDER
- [ ] `mobile/stores/authStore.ts` - ENTIRE FILE
- [ ] Any store that makes API calls

### Create These Hooks:

- [ ] `useLoginMutation.ts` - Replaces authStore.login()
- [ ] `useSignupMutation.ts` - Replaces authStore.signup()
- [ ] `useLogoutMutation.ts` - Replaces authStore.logout()
- [ ] `useCurrentUser.ts` - Replaces getProfile()

### Update Components:

- [ ] Replace all `authStore.login()` with `useLoginMutation()`
- [ ] Replace all `authStore.signup()` with `useSignupMutation()`
- [ ] Replace all store API calls with TanStack Query hooks

## Authentication Flow (Complete Example)

### 1. Signup Mutation

```typescript
// hooks/mutation/useSignupMutation.ts
export const useSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: SignupForm) => {
      const transformed = transformRegistrationData(formData);
      return AuthenticationService.postAuthRegister({
        requestBody: transformed,
      });
    },
    onSuccess: async response => {
      await AsyncStorage.setItem('access_token', response.access_token);
      await AsyncStorage.setItem('refresh_token', response.refresh_token);
      queryClient.setQueryData(['user'], response.user);
      router.push('/onboarding');
    },
  });
};
```

### 2. Component Usage

```typescript
function SignupScreen() {
  const signupMutation = useSignupMutation();

  return <Form onSubmit={data => signupMutation.mutate(data)} />;
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
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
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
  enabled: !!user?.id, // Only fetch when user exists
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
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});
```

## Folder Structure Summary

```
mobile/
├── hooks/
│   ├── api/              # Generated (NEVER EDIT)
│   │   └── *.gen.ts
│   ├── mutation/         # ALL mutations
│   ├── query/           # ALL queries
│   └── utils/           # Helpers
├── services/            # ❌ DELETE THIS FOLDER
└── stores/              # ✅ UI state ONLY
    ├── authStore.ts     # ❌ DELETE THIS FILE
    └── uiStore.ts       # ✅ KEEP (UI only)
```

## Rules for Claude/AI Code Generation

When generating code for this architecture:

1. **NEVER create a services folder** - Use generated API client only
2. **NEVER put API calls in stores** - Stores are UI-only
3. **ALWAYS use TanStack Query for server operations** - No exceptions
4. **ALWAYS follow this pattern**: Component → Hook → Generated Client → API
5. **Authentication is NOT special** - It uses mutations like everything else
6. **Every GET request needs a useQuery hook**
7. **Every POST/PUT/PATCH/DELETE needs a useMutation hook**
8. **Token storage happens in mutation onSuccess, not stores**
9. **User data lives in query cache, not stores**
10. **If it talks to the server, it goes through TanStack Query**

## Validation Questions

Before implementing, ask yourself:

- Does my store import any API services? (Should be NO)
- Do my components import services directly? (Should be NO)
- Does every API call go through TanStack Query? (Should be YES)
- Is authentication handled by mutations? (Should be YES)
- Are tokens stored in mutation callbacks? (Should be YES)

## Final Notes

This architecture is:

- **Proven at scale** by Coinbase, Discord, Shopify
- **The official recommendation** from TanStack Query docs
- **Not optional** - deviating creates technical debt
- **Simpler than hybrid approaches** - one pattern for everything

There are **NO special cases** where stores should call APIs directly. If you think you found one, you're wrong - use TanStack Query.
