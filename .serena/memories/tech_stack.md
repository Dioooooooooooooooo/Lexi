# Technology Stack

## Frontend (Mobile)
- **Framework**: React Native with Expo (~52.0.0)
- **Routing**: Expo Router v4 (file-based routing)
- **Styling**: 
  - NativeWind v4 (Tailwind CSS for React Native)
  - Tailwind CSS v3.4 with custom design system
  - React Native Paper for Material Design components
- **State Management**: Zustand v5
- **API Client**: TanStack Query v5 with OpenAPI-generated hooks
- **UI Components**:
  - Custom component library with shadcn/ui patterns
  - RN Primitives for cross-platform components
  - FontAwesome icons
  - Lottie animations
- **Other Libraries**:
  - React Native Reanimated for animations
  - Expo modules (file system, image picker, haptics, etc.)
  - Google Sign-In integration
  - Text-to-Speech (TTS)

## Backend (API)
- **Framework**: NestJS v11 (Node.js/TypeScript)
- **Database**: PostgreSQL with Kysely query builder
- **Authentication**: JWT with Passport
- **API Documentation**: Swagger/OpenAPI v3
- **Validation**: class-validator and class-transformer
- **Security**: bcrypt for password hashing, throttling

## Development Tools
- **Package Manager**: pnpm (workspace setup)
- **TypeScript**: v5.3+ with strict mode
- **Linting**: ESLint v9 with TypeScript rules
- **Formatting**: Prettier v3 with trailing commas
- **Testing**: Jest for both frontend and backend
- **Build**: Expo CLI, NestJS CLI

## Deployment
- **Backend**: Vercel (vercel.json config present)
- **Mobile**: Expo Application Services (EAS)

## Code Generation
- **API Client**: OpenAPI React Query Codegen for auto-generated API hooks
- **Database Types**: Kysely Codegen for type-safe database queries