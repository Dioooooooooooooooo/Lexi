# Essential Development Commands

## Mobile App Commands (from mobile/)
```bash
# Start development server
pnpm start
# or
npx expo start

# Platform-specific development
pnpm run android    # Run on Android emulator
pnpm run ios        # Run on iOS simulator  
pnpm run web        # Run in web browser

# Code quality
pnpm run lint       # ESLint
pnpm run format     # Prettier formatting
pnpm test           # Jest tests

# API Integration
pnpm run openapi:spec     # Download OpenAPI spec from backend
pnpm run openapi:client   # Generate API client hooks
pnpm run dev:with-api     # Full development with API generation
```

## Backend API Commands (from backend/)
```bash
# Development
pnpm run start:dev    # Development with hot reload
pnpm run start        # Standard start
pnpm run start:prod   # Production mode

# Build and deployment
pnpm run build        # Compile TypeScript

# Code quality  
pnpm run lint         # ESLint with auto-fix
pnpm run format       # Prettier formatting
pnpm run test         # Unit tests
pnpm run test:e2e     # End-to-end tests
pnpm run test:cov     # Test coverage

# Database
pnpm run generate:schema  # Generate Kysely database types
```

## Root Level Commands
```bash
# Install dependencies for all packages
pnpm install

# Run commands across workspace
pnpm run --recursive <command>
```

## Git Commands (Windows)
```cmd
git status
git add .
git commit -m "message"
git push
git pull
```

## File Operations (Windows)
```cmd
dir                   # List directory contents
cd <directory>        # Change directory
type <filename>       # View file contents
findstr "pattern" *.* # Search in files
```

## Task Completion Workflow
After completing any development task:
1. `pnpm run lint` (in relevant package)
2. `pnpm run format` (in relevant package)  
3. `pnpm test` (if tests exist)
4. `git add . && git commit -m "description"`