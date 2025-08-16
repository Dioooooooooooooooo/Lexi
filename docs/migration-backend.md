# Backend Migration: C# → NestJS

## Migration Status
**Last Updated**: January 2025  
**Package Manager**: pnpm (monorepo-wide)  
**Reference Code**: LexiLearner/server (C# implementation)

## Migration Strategy

**Vertical feature migration**: Migrate complete features from C# ASP.NET Core to NestJS one at a time.

## C# Controllers → NestJS Modules

| C# Controller | NestJS Module | Endpoints | Status | Priority |
|---------------|---------------|-----------|--------|----------|
| **AuthController.cs** | `auth.module.ts` | 7 endpoints | 🔄 In Progress | High |
| **UsersController.cs** | `users.module.ts` | 5 endpoints | ❌ Not started | High |
| **ClassroomController.cs** | `classrooms.module.ts` | 8 endpoints | 🔄 In Progress | High |
| **MinigamesController.cs** | `minigames.module.ts` | 5 endpoints | 🔄 In Progress | Medium |
| **ReadingMaterialsController.cs** | `reading-materials.module.ts` | 3 endpoints | ❌ Not started | Medium |
| **ReadingSessionsController.cs** | `reading-sessions.module.ts` | 3 endpoints | ❌ Not started | Medium |
| **AchievementsController.cs** | `achievements.module.ts` | 2 endpoints | ❌ Not started | Low |

## Current Sprint Focus

### 🔄 In Progress - Authentication System
- [x] Basic login/signup endpoints
- [x] JWT token generation
- [ ] Refresh token mechanism
- [ ] Google OAuth integration
- [ ] Two-factor authentication
- [ ] Password reset flow

### 🔄 In Progress - Classroom Management  
- [x] Create classroom endpoint
- [x] List classrooms endpoint
- [ ] Join classroom by code
- [ ] Student enrollment management
- [ ] Classroom settings/permissions
- [ ] Assignment creation

## Endpoint Mapping

### Authentication Endpoints
| C# Route | Method | NestJS Route | Method | Status | Notes |
|----------|--------|--------------|---------|---------|-------|
| `/api/auth/login` | POST | `/auth/login` | POST | ✅ Done | Basic JWT auth |
| `/api/auth/register` | POST | `/auth/register` | POST | ✅ Done | User registration |
| `/api/auth/refresh` | POST | `/auth/refresh` | POST | ❌ Todo | Refresh tokens |
| `/api/auth/google` | POST | `/auth/google` | POST | ❌ Todo | OAuth integration |
| `/api/auth/2fa/send` | POST | `/auth/2fa/send` | POST | ❌ Todo | SMS/email 2FA |
| `/api/auth/2fa/verify` | POST | `/auth/2fa/verify` | POST | ❌ Todo | 2FA verification |
| `/api/auth/logout` | POST | `/auth/logout` | POST | ❌ Todo | Token invalidation |

### Classroom Endpoints
| C# Route | Method | NestJS Route | Method | Status | Notes |
|----------|--------|--------------|---------|---------|-------|
| `/api/classrooms` | GET | `/classrooms` | GET | ✅ Done | List user classrooms |
| `/api/classrooms` | POST | `/classrooms` | POST | ✅ Done | Create classroom |
| `/api/classrooms/{id}` | GET | `/classrooms/{id}` | GET | 🔄 WIP | Classroom details |
| `/api/classrooms/{id}` | PUT | `/classrooms/{id}` | PUT | ❌ Todo | Update classroom |
| `/api/classrooms/{id}` | DELETE | `/classrooms/{id}` | DELETE | ❌ Todo | Delete classroom |
| `/api/classrooms/join` | POST | `/classrooms/join` | POST | ❌ Todo | Join by code |
| `/api/classrooms/{id}/students` | GET | `/classrooms/{id}/students` | GET | ❌ Todo | List students |
| `/api/classrooms/{id}/assignments` | GET | `/classrooms/{id}/assignments` | GET | ❌ Todo | Assignments |

## Technical Migration Notes

### Database Schema
- **Current**: Entity Framework with auto-migrations
- **Target**: Kysely with manual migrations
- **Strategy**: Keep exact same table structure initially

### Authentication Changes
- **C# JWT**: Custom implementation with refresh tokens
- **NestJS JWT**: Passport JWT strategy
- **Compatibility**: Maintain same token structure for mobile app

### Query Optimization
- **EF Issues**: N+1 queries, inefficient joins
- **Kysely Benefits**: Hand-optimized SQL, better performance
- **Priority**: Profile and optimize slow endpoints first

## Completion Criteria (Per Feature)

### Backend Complete ✅
- [ ] All C# endpoints migrated to NestJS
- [ ] Swagger decorators added (@ApiOperation, @ApiResponse)
- [ ] Kysely queries implemented and optimized
- [ ] Authentication guards applied
- [ ] Unit tests written (>90% coverage)
- [ ] Integration tests passing
- [ ] Performance meets/exceeds C# version

### Quality Assurance ✅
- [ ] Side-by-side testing vs C# endpoints
- [ ] Data integrity validated
- [ ] Security audit completed
- [ ] Load testing passed
- [ ] Error handling comprehensive

## Next Sprint Planning

### Sprint 2 Targets
1. **Complete Authentication** - Refresh tokens, OAuth, 2FA
2. **Complete Classrooms** - All CRUD operations
3. **User Management** - Profile, settings, roles
4. **Auto-client Generation** - OpenAPI spec ready

### Sprint 3 Targets  
1. **Minigames System** - Game logic and scoring
2. **Reading Materials** - Content management
3. **Reading Sessions** - Progress tracking
4. **Performance Optimization** - Database query tuning