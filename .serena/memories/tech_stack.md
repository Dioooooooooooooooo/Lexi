# LexiLearner - Technology Stack

## Backend Stack
- **Framework**: NestJS 11.x (Node.js framework)
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL with Kysely query builder
- **Authentication**: JWT with passport-jwt
- **API Documentation**: Swagger/OpenAPI auto-generation
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + Supertest for unit/integration tests
- **Security**: bcrypt for password hashing, @nestjs/throttler for rate limiting

## Mobile Stack
- **Framework**: Expo 52.x + React Native 0.76.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS (NativeWind 4.x)
- **State Management**: Zustand 5.x
- **Data Fetching**: Tanstack Query 5.x
- **Navigation**: Expo Router 4.x
- **UI Components**: Custom components + React Native Paper + @rn-primitives
- **Icons**: Lucide React Native + FontAwesome
- **Testing**: Jest + jest-expo

## Development Tools
- **Package Manager**: pnpm (for backend), npm (for mobile)
- **Monorepo**: pnpm workspaces
- **Linting**: ESLint 9.x + typescript-eslint
- **Formatting**: Prettier 3.x
- **Git Hooks**: Husky + lint-staged
- **Commit Standards**: Conventional Commits with commitlint
- **API Generation**: swagger-typescript-api + @openapitools/openapi-generator-cli

## Deployment
- **Backend**: Vercel serverless functions
- **Database**: PostgreSQL on Railway/Supabase
- **Mobile**: Expo EAS Build → App Store/Google Play
- **Updates**: Expo Updates for OTA updates

## System Requirements
- Node.js 18+ and npm 9+
- pnpm (latest)
- PostgreSQL
- Expo CLI
- Windows development environment