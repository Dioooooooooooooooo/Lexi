# TanStack Query Architecture Patterns

## Three-Layer Architecture

### 1. Services Layer (Foundation API)
**Location**: `mobile/services/`
**Purpose**: Direct API communication, raw HTTP requests
**When to use**: Foundation layer for all API interactions
**Examples**: `AuthService.ts`, `UserService.ts`

### 2. Stores Layer (Business Logic & Orchestration)
**Location**: `mobile/stores/`
**Purpose**: Business logic, state orchestration, complex workflows
**When to use**: 
- One-time operations (registration, login, logout)
- Complex business logic requiring multiple API calls
- State that needs to persist across app sessions
**Examples**: `authStore.ts`, `userStore.ts`
**Key**: Uses services directly, not TanStack Query hooks

### 3. Hooks Layer (Caching & Data Fetching)
**Location**: `mobile/hooks/query/` and `mobile/hooks/mutation/`
**Purpose**: Data caching, optimistic updates, background refetching
**When to use**:
- Repeated data fetching operations
- Data that benefits from caching
- Real-time data synchronization
**Structure**:
- `query/` - for useQuery hooks (data fetching)
- `mutation/` - for useMutation hooks (data modification)

## Registration Flow Implementation

**Current Implementation**: Uses Store-based approach
- `signup3.tsx:46` calls `authStore.signup(form)`
- `authStore.ts` uses `AuthenticationService.postAuthRegister()` with data transformation
- Perfect for one-time registration workflow with token storage and navigation

## Data Transformation

**Issue**: UI uses camelCase, API expects snake_case
**Solution**: `authTransformers.ts` handles conversion
```typescript
export const transformRegistrationData = (formData: Record<string, any>): RegisterDto => {
  return {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    confirm_password: formData.confirmPassword, // camelCase → snake_case
    first_name: formData.firstName,             // camelCase → snake_case
    last_name: formData.lastName,               // camelCase → snake_case
    role: formData.role as 'Pupil' | 'Teacher',
  };
};
```

## Hook Organization

**Structure**:
```
mobile/hooks/
├── api/           # Auto-generated API client & types
├── query/         # useQuery hooks for data fetching
├── mutation/      # useMutation hooks for data modification
├── utils/         # Transformation utilities
└── index.ts       # Centralized exports
```

## Key Integration Points

1. **authStore.signup()** - Uses new `AuthenticationService` with transformation
2. **Token Storage** - Standardized to snake_case keys (`access_token`, `refresh_token`)
3. **Type Safety** - Uses auto-generated types from OpenAPI spec
4. **Error Handling** - Consistent error transformation and user feedback