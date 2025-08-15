# Suggested Commands for LexiLearner Development

## Backend Commands (lexilearner-backend/)
```bash
# Package management
pnpm install

# Development
pnpm run start:dev          # Start in watch mode
pnpm run start              # Start normally
pnpm run start:prod         # Start in production mode

# Building
pnpm run build              # Build the application

# Testing
pnpm run test               # Run unit tests
pnpm run test:watch         # Run tests in watch mode
pnpm run test:e2e           # Run end-to-end tests
pnpm run test:cov           # Run tests with coverage

# Code Quality
pnpm run lint               # Run ESLint (with --fix)
pnpm run format             # Format code with Prettier
```

## Frontend Commands (LexiLearner/lexilearner/)
```bash
# Package management
npm install

# Development
npm start                   # Start Expo development server
npm run android             # Run on Android
npm run ios                 # Run on iOS
npm run web                 # Run on web

# Testing
npm run test                # Run Jest tests

# Code Quality
npm run lint                # Run Expo lint

# Utilities
npm run reset-project       # Reset to blank project
```

## Windows System Commands
```cmd
# File operations
dir                         # List files/directories
cd [path]                   # Change directory
mkdir [name]                # Create directory
rmdir [name]                # Remove directory

# Git operations
git status
git add .
git commit -m "message"
git push
git pull

# Process management
tasklist                    # List running processes
taskkill /PID [id]          # Kill process by ID
```

## API Documentation
When backend is running: http://localhost:3000/docs (Swagger UI)