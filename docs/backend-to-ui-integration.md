# Backend-to-UI Integration: Connecting React Native to NestJS

## Integration Strategy

**Replace manual C# API calls** with auto-generated NestJS client using Tanstack Query hooks for type-safe, consistent integration.

The React Native app currently talks to C# backend - we need to connect it to the new NestJS backend with zero manual API maintenance.

## Current State Analysis

### Manual API Services (Current)
| Service File | Endpoints Used | API Calls | Status | Complexity |
|-------------|----------------|-----------|--------|------------|
| `AuthService.ts` | 7 auth endpoints | Manual fetch | ❌ To migrate | High |
| `ClassroomService.ts` | 8 classroom endpoints | Manual axios | ❌ To migrate | High |
| `UserService.ts` | 5 user endpoints | Manual fetch | ❌ To migrate | Medium |
| `minigameService.ts` | 5 game endpoints | Manual axios | ❌ To migrate | Medium |
| `ReadingMaterialService.ts` | 3 content endpoints | Manual fetch | ❌ To migrate | Medium |
| `ReadingSessionService.ts` | 3 session endpoints | Manual axios | ❌ To migrate | Low |

### Zustand Stores (Current State Management)
| Store File | API Dependencies | Migration Impact | Priority |
|-----------|------------------|------------------|----------|
| `authStore.ts` | AuthService | High - core auth flow | High |
| `classroomStore.ts` | ClassroomService | High - main feature | High |
| `userStore.ts` | UserService | Medium - profile data | Medium |
| `miniGameStore.ts` | minigameService | Medium - game state | Medium |
| `readingContentStore.ts` | ReadingMaterialService | Low - content cache | Low |
| `readingSessionStore.ts` | ReadingSessionService | Low - session tracking | Low |

## Auto-Generated Client Target

### Generated Structure
```
mobile/src/api/generated/
├── types/              # TypeScript interfaces
│   ├── auth.types.ts
│   ├── classroom.types.ts
│   └── ...
├── hooks/              # Tanstack Query hooks  
│   ├── useAuthMutation.ts
│   ├── useClassroomQuery.ts
│   └── ...
├── client/             # Base API client
│   ├── api-client.ts
│   └── error-handler.ts
└── index.ts            # Export all generated code
```

## Migration Progress by Feature

### 🎯 Authentication System
**Current**: Manual `AuthService.ts` with fetch calls
```typescript
// Current manual approach
const login = async (credentials) => {
  const response = await fetch('/auth/login', {
    method: 'POST', 
    body: JSON.stringify(credentials)
  });
  return response.json();
};
```

**Target**: Auto-generated Tanstack Query hooks
```typescript
// Generated hook approach  
const { mutate: login, isLoading } = useLoginMutation();
const handleLogin = () => login(credentials);
```

**Migration Checklist:**
- [ ] Generate auth types from OpenAPI spec
- [ ] Replace manual login call with `useLoginMutation`
- [ ] Replace manual signup call with `useSignupMutation`
- [ ] Implement refresh token with `useRefreshMutation`
- [ ] Update error handling in auth store
- [ ] Test authentication flow end-to-end

### 🏫 Classroom Management  
**Current**: Manual `ClassroomService.ts` with axios
```typescript
// Current manual approach
export class ClassroomService {
  static async getClassrooms() {
    return axiosInstance.get('/classrooms');
  }
  static async createClassroom(data) {
    return axiosInstance.post('/classrooms', data);
  }
}
```

**Target**: Auto-generated queries and mutations
```typescript
// Generated approach
const { data: classrooms, isLoading } = useClassroomsQuery();
const { mutate: createClassroom } = useCreateClassroomMutation();
```

**Migration Checklist:**
- [ ] Generate classroom types from OpenAPI spec
- [ ] Replace `getClassrooms()` with `useClassroomsQuery`
- [ ] Replace `createClassroom()` with `useCreateClassroomMutation`
- [ ] Replace `updateClassroom()` with `useUpdateClassroomMutation` 
- [ ] Update classroom store to use generated hooks
- [ ] Test classroom CRUD operations

### 👤 User Management
**Current**: Manual `UserService.ts` calls
- [ ] Replace profile fetch with `useUserProfileQuery`
- [ ] Replace profile update with `useUpdateProfileMutation`
- [ ] Replace avatar upload with `useUploadAvatarMutation`
- [ ] Update user store integration
- [ ] Test profile management flow

### 🎮 Minigames System
**Current**: Manual `minigameService.ts` calls
- [ ] Replace game list with `useMinigamesQuery`
- [ ] Replace start game with `useStartGameMutation`
- [ ] Replace submit score with `useSubmitScoreMutation`
- [ ] Update game stores integration
- [ ] Test minigame workflows

## Screen-Level Migration

### High Priority Screens
| Screen | Current API Calls | Generated Hooks Needed | Status |
|--------|------------------|------------------------|---------|
| `signin.tsx` | Manual auth calls | `useLoginMutation` | ❌ Todo |
| `signup.tsx` | Manual auth calls | `useSignupMutation` | ❌ Todo |
| `classroom/index.tsx` | Manual classroom list | `useClassroomsQuery` | ❌ Todo |
| `classroom/createclassroom.tsx` | Manual create call | `useCreateClassroomMutation` | ❌ Todo |
| `profile/settings.tsx` | Manual profile calls | `useUserProfileQuery` | ❌ Todo |

### Medium Priority Screens  
| Screen | Current API Calls | Generated Hooks Needed | Status |
|--------|------------------|------------------------|---------|
| `minigames/play.tsx` | Manual game calls | `useMinigamesQuery` | ❌ Todo |
| `content/[id]/read.tsx` | Manual content calls | `useReadingMaterialQuery` | ❌ Todo |
| `profile/achievementslist.tsx` | Manual achievement calls | `useAchievementsQuery` | ❌ Todo |

## Technical Implementation

### Error Handling Migration
**Current**: Inconsistent error handling per service
```typescript
// Different error patterns across services
try {
  const response = await fetch('/api/auth/login');
  if (!response.ok) throw new Error('Login failed');
} catch (error) {
  // Handle differently in each service
}
```

**Target**: Centralized error handling with generated client
```typescript
// Consistent error handling via generated client
const { mutate: login, error, isError } = useLoginMutation({
  onError: (error) => {
    // Centralized error handling
    handleApiError(error);
  }
});
```

### Loading States Migration
**Current**: Manual loading state management
```typescript
// Manual loading states in components
const [isLoading, setIsLoading] = useState(false);
const handleLogin = async () => {
  setIsLoading(true);
  try {
    await AuthService.login(credentials);
  } finally {
    setIsLoading(false);
  }
};
```

**Target**: Automatic loading states from hooks
```typescript
// Automatic loading states
const { mutate: login, isLoading } = useLoginMutation();
```

## Migration Validation

### Testing Strategy
1. **Component Tests**: Verify hooks integration
2. **Integration Tests**: Test complete user flows
3. **Type Safety**: Ensure no TypeScript errors
4. **Performance**: Compare network efficiency
5. **Error Handling**: Validate error boundaries

### Completion Criteria (Per Feature)
- [ ] All manual API calls replaced with generated hooks
- [ ] TypeScript compilation successful
- [ ] Loading states working correctly  
- [ ] Error handling consistent and comprehensive
- [ ] Zustand stores updated to use new hooks
- [ ] User acceptance testing passed
- [ ] Performance metrics maintained/improved

## Sprint Planning

### Sprint 1: Foundation
- [ ] Set up OpenAPI client generation pipeline
- [ ] Generate initial types and hooks
- [ ] Migrate authentication system
- [ ] Update auth-related screens

### Sprint 2: Core Features  
- [ ] Migrate classroom management
- [ ] Update classroom-related screens
- [ ] Migrate user profile management
- [ ] Test core user workflows

### Sprint 3: Additional Features
- [ ] Migrate minigames system
- [ ] Migrate reading materials
- [ ] Update remaining screens
- [ ] Final testing and optimization