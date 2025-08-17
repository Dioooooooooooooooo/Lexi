# LexiLearner 📚

> **Modern Language Learning Platform** - Built with TypeScript and automated API generation

A comprehensive language learning platform with classroom management, interactive minigames, and reading comprehension tools.

## 🏗️ Architecture

```
📁 lexilearner/
├── 📁 backend/           # NestJS API server
├── 📁 mobile/            # React Native app
├── 📁 docs/              # Project documentation
├── 📁 scripts/           # API generation automation
└── 📄 package.json       # Workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **pnpm** 8+
- **PostgreSQL** database
- **Expo CLI** (for mobile development)

### Installation
```bash
# Install all dependencies
pnpm install

# Or install individually
cd backend && pnpm install
cd mobile && pnpm install
```

### Development
```bash
# Start both backend and mobile concurrently
pnpm dev

# Or start individually
pnpm dev:backend    # NestJS server on :3000
pnpm dev:mobile     # Expo dev server
```

## 📱 Applications

### Backend API (NestJS)
- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL + Kysely Query Builder
- **Auth**: JWT with refresh tokens
- **Docs**: Auto-generated Swagger at `/docs`
- **Port**: http://localhost:3000

**Key Features:**
- 🔐 Authentication & Authorization
- 👥 Classroom Management
- 🎮 Interactive Minigames API
- 📖 Reading Materials & Sessions
- 🏆 Achievements & Progress Tracking

### Mobile App (React Native)
- **Framework**: Expo + React Native
- **Language**: TypeScript
- **Styling**: Tailwind CSS (NativeWind)
- **State**: Zustand + Tanstack Query
- **Navigation**: Expo Router

**Key Features:**
- 📱 Cross-platform (iOS/Android)
- 🔄 Auto-generated API client
- 🎯 Interactive learning games
- 📊 Progress tracking & analytics
- 👨‍🏫 Teacher & student roles


## 🎯 Code-First API Development

**Automated workflow keeps frontend and backend always in sync:**

```bash
# 1. Write NestJS code with Swagger decorators
# 2. Generate OpenAPI spec from code
pnpm openapi:spec

# 3. Generate type-safe React Native client
pnpm openapi:client

# 4. Use generated Tanstack Query hooks in React Native
# 5. Always in sync - no manual API maintenance! 🎉
```

## 🛠️ Development Commands

### Root Level (Monorepo)
```bash
pnpm dev          # Start all applications
pnpm build        # Build all applications
pnpm test         # Run all test suites
pnpm lint         # Lint all projects
pnpm clean        # Clean all build artifacts
```

### Backend Commands
```bash
cd backend
pnpm install         # Install dependencies
pnpm run start:dev   # Development server
pnpm run build       # Build application  
pnpm run test        # Run tests
pnpm run lint        # ESLint + Prettier
```

### Mobile Commands  
```bash
cd mobile
pnpm install          # Install dependencies
pnpm start            # Start Expo dev server
pnpm run android      # Run on Android
pnpm run ios          # Run on iOS
pnpm test             # Run Jest tests
```

### API Generation Commands
```bash
pnpm openapi:spec     # Generate OpenAPI spec from NestJS
pnpm openapi:client   # Generate React Native client
pnpm openapi:docs     # Generate both spec and client
```

## 📋 Project Management

### Documentation
- 📚 **[Project Documentation](./docs/README.md)** - Architecture and development guide
- 📖 **API Docs**: http://localhost:3000/docs (when backend running)
- 🔧 **Auto-generated Client**: Always reflects current backend API

### Development Workflow
1. **Backend**: Implement NestJS endpoint with Swagger decorators
2. **Generate**: Create API client automatically
3. **Frontend**: Use generated Tanstack Query hooks
4. **Test**: Verify functionality end-to-end
5. **Deploy**: Ship with confidence

## 🧪 Testing

### Automated Testing
```bash
pnpm test                 # All test suites
pnpm test:backend         # NestJS unit/integration tests
pnpm test:mobile          # React Native component tests
```

### Quality Assurance
- **Unit Tests**: Jest + Supertest
- **Integration Tests**: TestContainers + PostgreSQL
- **E2E Tests**: Expo testing utilities
- **Performance**: Load testing and optimization
- **Security**: Automated vulnerability scanning

## 📦 Dependencies

### Backend Stack
- **NestJS** - Progressive Node.js framework
- **Kysely** - Type-safe SQL query builder  
- **PostgreSQL** - Primary database
- **Swagger** - API documentation
- **Jest** - Testing framework

### Mobile Stack
- **Expo** - React Native development platform
- **Tanstack Query** - Data fetching/caching
- **Zustand** - State management
- **NativeWind** - Tailwind CSS for React Native
- **React Navigation** - Screen navigation

### Shared Tools
- **TypeScript** - Type safety across stack
- **ESLint/Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Conventional commits

## 🚢 Deployment

### Backend (NestJS)
- **Production**: Vercel serverless functions
- **Staging**: Docker containers
- **Database**: PostgreSQL on Railway/Supabase

### Mobile App
- **Distribution**: Expo EAS Build
- **Platforms**: iOS App Store, Google Play Store
- **Updates**: Over-the-air with Expo Updates

## 🤝 Contributing

### Getting Started
1. Clone repository
2. Run `pnpm install`
3. Set up PostgreSQL database
4. Copy `.env.example` → `.env` in backend/
5. Start development: `pnpm dev`

### Code Guidelines
- **Commits**: Follow conventional commit format
- **PRs**: Include migration progress updates  
- **Testing**: Write tests for new features
- **Documentation**: Update API docs as needed

### Migration Guidelines
- Always reference C# implementation for business logic
- Maintain backward compatibility where possible
- Update progress tracking after each feature
- Test against existing mobile app functionality

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 🏆 Team

**LexiLearner Development Team** - Building the future of language learning!

---

*🚀 **Status**: Active migration from C# to TypeScript stack*  
*📅 **Last Updated**: $(date)*  
*🎯 **Goal**: Complete type-safe, auto-generated API client*