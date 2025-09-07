# Architecture Patterns: Services, Stores, and TanStack Query Hooks

## 🏗️ Three-Layer Architecture (Optimal Pattern)

```typescript
// Layer 1: Components (UI)
Component (signup3.tsx)

// Layer 2A: Business Logic (Immediate Operations)
Store (authStore.signup()) ← ✅ Perfect for one-time operations

// Layer 2B: Caching Logic (Repeated Operations)
Hook (useRegister()) ← ✅ Perfect for operations needing caching

// Layer 3: Foundation (API Communication)
Service (AuthenticationService) ← ✅ Used by BOTH layers above
```

## 🎯 When to Use Each Layer

### Use Stores (One-time Operations)

**Perfect For:**

- Registration, Login, Logout (happens once)
- Business orchestration (multi-step processes)
- Complex state updates requiring immediate global changes
- Operations that need navigation/routing after completion

**Example:**

```typescript
// ✅ Registration flow in authStore.signup()
authStore.signup() {
  1. Transform form data (camelCase → snake_case)
  2. Call API via AuthenticationService.postAuthRegister()
  3. Store tokens in AsyncStorage
  4. Fetch user profile
  5. Update global user state
  6. Handle navigation to next screen
}
```

### Use TanStack Query Hooks (Repeated Operations)

**Perfect For:**

- Data that needs caching (User profile, lists)
- Background updates (Real-time data)
- Optimistic updates (Better UX)
- Loading/error states (Complex UI states)
- Operations that benefit from retry logic and cache invalidation

**Example:**

```typescript
// ✅ Profile screen (needs caching + auto-refresh)
const { data: user, isLoading } = useAuthMe(); // Cached, auto-refreshed

// ✅ Classrooms list (needs caching + background updates)
const { data: classrooms } = useClassrooms(); // Auto-refetch when stale

// ✅ Create classroom (needs optimistic updates)
const { mutate } = useCreateClassroom(); // Immediate UI update
```

### Use Services Directly (Simple Operations)

**Perfect For:**

- Pure API communication
- Single API calls without complex logic
- Utility functions that transform data

**Example:**

```typescript
// ✅ Simple logout
await AuthenticationService.postAuthLogout();
```

## 🔄 Current Implementation

### Registration Flow (Working)

```typescript
// signup3.tsx → authStore.signup() → AuthenticationService.postAuthRegister()
// ✅ Handles: data transformation, token storage, profile fetch, navigation
```

### TanStack Query Structure

```
mobile/hooks/
├── api/
│   ├── requests/            # Auto-generated OpenAPI client
│   └── apiUtils.ts          # Query keys & auth setup
├── mutation/
│   ├── useAuthMutations.ts     # Login, register, logout, profile updates
│   ├── useClassroomMutations.ts # Create, update, delete classrooms
│   ├── useMinigameMutations.ts  # Complete sessions, log game results
│   └── usePupilMutations.ts     # Update pupil profiles
├── query/
│   ├── useAuthQueries.ts        # Profile fetching, token verification
│   ├── useClassroomQueries.ts   # List, detail classroom queries
│   ├── useMinigameQueries.ts    # Random minigames by material/session
│   └── usePupilQueries.ts       # Leaderboards, user lookup
├── utils/
│   └── authTransformers.ts      # UI ↔ API data transformation
└── index.ts                     # Centralized exports for all hooks
```

## 🎯 Key Principles

1. **Services = Foundation** - Always the base layer for API communication
2. **Stores = Business Logic** - For complex operations requiring orchestration
3. **Hooks = Caching + State** - For data that benefits from caching and automatic updates
4. **All layers can use Services** - Services are the foundation for everything
5. **Choose based on operation type** - One-time vs repeated, simple vs complex

## 💡 Context7/TanStack Evidence

- **TanStack Query mutations** are designed for caching, retry behavior, and lifecycle callbacks
- **Registration is a one-time operation** that doesn't benefit from query caching
- **Stores handle business orchestration** that hooks can't manage
- **Services provide pure API communication** that both stores and hooks can use

## 📱 Mobile App Signup Flow

- **signup.tsx (Step 1)** → Form collection + social auth
- **signup2.tsx (Step 2)** → Additional form data
- **signup3.tsx (Step 3)** → **MAIN REGISTRATION** via `authStore.signup()`
- **signup4.tsx (Step 4)** → Profile completion via `userStore.updateProfile()`

Only signup3.tsx uses authStore for actual registration - this is where the new architecture integration happens.
