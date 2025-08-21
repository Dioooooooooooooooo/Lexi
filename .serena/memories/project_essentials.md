# LexiLearner - Project Essentials

## What This Is
Modern language learning platform with classroom management, interactive minigames, and reading tools. Built for educational environments with teacher/student roles.

## Architecture
TypeScript monorepo with:
- **Backend**: NestJS API (port 3000) 
- **Mobile**: React Native/Expo app
- **Migration**: Active C# → TypeScript conversion

## Core Tech Stack
- **Languages**: TypeScript everywhere
- **Package Manager**: pnpm 10.14.0 (workspaces)
- **Backend**: NestJS + PostgreSQL + Kysely + JWT + Swagger
- **Mobile**: Expo + React Native + NativeWind + Zustand + TanStack Query
- **Quality**: ESLint + Prettier + Jest + Husky + Conventional Commits
- **API**: OpenAPI code generation (backend → mobile client)

## Key Features
- 🔐 Authentication & Authorization
- 👥 Classroom Management  
- 🎮 Interactive Learning Minigames
- 📖 Reading Materials & Sessions
- 🏆 Progress Tracking & Leaderboards
- 📱 Cross-platform Mobile Interface

## Development Flow
1. Write NestJS endpoints with Swagger decorators
2. Generate OpenAPI spec → TypeScript client → TanStack Query hooks
3. Use generated hooks in React Native components
4. Always type-safe, always in sync

## Important Notes
- **API-first development** - backend drives frontend
- **Windows compatible** - all commands work in PowerShell/CMD
- **Migration tracking** - check `API_MIGRATION_PROGRESS.md`
- **Quality gates** - lint/test/build must pass before commits