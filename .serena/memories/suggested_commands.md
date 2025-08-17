# LexiLearner - Suggested Commands

## Root Level (Monorepo) Commands

```bash
# Development
npm run dev                    # Start both backend and mobile concurrently
npm run dev:backend           # Start NestJS server on :3000
npm run dev:mobile            # Start Expo dev server

# Installation
npm run install:all           # Install all dependencies (uses pnpm)
npm run install:backend       # Install backend dependencies (pnpm)
npm run install:mobile        # Install mobile dependencies (pnpm)

# Building
npm run build                 # Build all applications
npm run build:backend         # Build NestJS application
npm run build:mobile          # Build mobile app with Expo

# Testing
npm run test                  # Run all test suites
npm run test:backend          # Run backend Jest tests
npm run test:mobile           # Run mobile Jest tests

# Linting & Formatting
npm run lint                  # Lint all projects
npm run lint:backend          # Lint backend code
npm run lint:mobile           # Lint mobile code
npm run format                # Format all code
npm run format:backend        # Format backend code

# API Generation (Key Feature)
npm run openapi:spec          # Generate OpenAPI spec from NestJS code
npm run openapi:client        # Generate React Native client from spec
npm run openapi:docs          # Generate both spec and client

# Utilities
npm run clean                 # Clean all build artifacts
npm run migration:compare     # Compare APIs for migration tracking
npm run migration:test        # Run tests and compare APIs
```

## Backend-Specific Commands

```bash
cd backend

# Development
pnpm run start:dev            # Development server with watch mode
pnpm run start:debug          # Debug mode with inspect
pnpm run start:prod           # Production server

# Building & Testing
pnpm run build                # Build for production
pnpm run test                 # Unit tests
pnpm run test:watch           # Watch mode tests
pnpm run test:cov             # Coverage report
pnpm run test:e2e             # End-to-end tests

# Code Quality
pnpm run lint                 # ESLint with auto-fix
pnpm run format               # Prettier formatting

# Database
pnpm run generate:schema      # Generate Kysely types from DB
```

## Mobile-Specific Commands

```bash
cd mobile

# Development
pnpm start                    # Start Expo dev server
pnpm run android              # Run on Android device/emulator
pnpm run ios                  # Run on iOS device/simulator
pnpm run web                  # Run in web browser

# Testing
pnpm test                     # Jest tests in watch mode
pnpm run lint                 # ESLint check

# Utilities
pnpm run reset-project        # Reset project to clean state
```

## Windows-Specific System Commands

```bash
# File system navigation
dir                          # List directory contents
cd <path>                    # Change directory
mkdir <name>                 # Create directory
rmdir /s <name>              # Remove directory recursively

# Process management
tasklist                     # List running processes
taskkill /f /pid <pid>       # Kill process by PID
netstat -an                  # Show network connections

# Git operations (cross-platform)
git status                   # Check repository status
git log --oneline           # View commit history
git branch -a               # List all branches
```

## Essential Development Workflow

1. **Start development**: `npm run dev` (runs both backend and mobile)
2. **After backend changes**: `npm run openapi:client` (regenerate API client)
3. **Before committing**: `npm run lint` (ensure code quality)
4. **Run tests**: `npm run test` (verify functionality)
5. **Build for production**: `npm run build` (prepare for deployment)
