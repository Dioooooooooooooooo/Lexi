# LexiLearner - Codebase Structure

## Root Directory Structure
```
lexilearner/
├── backend/                 # NestJS API server
├── mobile/                  # React Native mobile app
├── docs/                    # Project documentation
├── scripts/                 # API generation automation scripts
├── package.json             # Monorepo workspace configuration
├── pnpm-workspace.yaml      # pnpm workspace config
├── pnpm-lock.yaml          # Lock file for dependencies
└── README.md               # Main project documentation
```

## Backend Structure (NestJS)
```
backend/
├── src/
│   ├── app/                 # Feature modules (auth, classrooms, etc.)
│   ├── common/              # Shared utilities and helpers
│   ├── configuration/       # App configuration and env handling
│   ├── database/            # Database schemas, migrations, types
│   ├── decorators/          # Custom NestJS decorators
│   ├── filters/             # Exception filters
│   ├── validators/          # Custom validation rules
│   ├── app.controller.ts    # Main app controller
│   ├── app.module.ts        # Root application module
│   ├── app.service.ts       # Main app service
│   └── main.ts              # Application bootstrap
├── test/                    # Test files and configurations
├── dist/                    # Compiled JavaScript output
├── package.json             # Backend dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── eslint.config.mjs        # ESLint configuration
├── nest-cli.json            # NestJS CLI configuration
└── vercel.json              # Vercel deployment config
```

## Mobile Structure (React Native + Expo)
```
mobile/
├── app/                     # Expo Router pages and layouts
├── components/              # Reusable UI components
├── constants/               # App constants and configuration
├── context/                 # React context providers
├── hooks/                   # Custom React hooks
├── lib/                     # Third-party library configurations
├── models/                  # Data models and interfaces
├── services/                # API services (auto-generated)
├── stores/                  # Zustand state management
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
├── assets/                  # Images, fonts, static files
├── android/                 # Android-specific configuration
├── package.json             # Mobile dependencies and scripts
├── app.json                 # Expo app configuration
├── eas.json                 # Expo Application Services config
├── babel.config.js          # Babel configuration
├── metro.config.js          # Metro bundler configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Scripts Directory
```
scripts/
├── generate-openapi-spec.js # Generates OpenAPI spec from NestJS
└── generate-client.js       # Generates React Native API client
```

## Documentation Structure
```
docs/
├── README.md                # Main documentation hub
├── migration-overview.md    # C# to TypeScript migration status
├── migration-backend.md     # Backend migration details
└── backend-to-ui-integration.md # API integration guide
```

## Key Configuration Files

### Root Level
- **package.json**: Monorepo scripts and workspace configuration
- **pnpm-workspace.yaml**: Defines backend and mobile as workspaces
- **.gitignore**: Git ignore patterns for all projects

### Backend Configuration
- **tsconfig.json**: TypeScript compiler options, path mapping
- **eslint.config.mjs**: ESLint + Prettier + TypeScript rules
- **nest-cli.json**: NestJS CLI settings and build configuration
- **vercel.json**: Deployment configuration for Vercel

### Mobile Configuration
- **app.json**: Expo app metadata and configuration
- **eas.json**: Expo Application Services build configuration
- **babel.config.js**: Babel presets for React Native
- **metro.config.js**: Metro bundler configuration
- **tailwind.config.js**: Tailwind CSS customization
- **nativewind-env.d.ts**: NativeWind TypeScript declarations

## Generated/Build Artifacts
- **backend/dist/**: Compiled NestJS application
- **mobile/.expo/**: Expo build cache and metadata
- **mobile/src/api/generated/**: Auto-generated API client
- **node_modules/**: Dependencies (in each workspace)
- **coverage/**: Test coverage reports

## Important Patterns
- **Monorepo structure**: Shared dependencies managed by pnpm workspaces
- **Code-first API**: Backend defines API, client is auto-generated
- **Type safety**: End-to-end TypeScript from backend to mobile
- **Module federation**: NestJS modules for feature organization
- **Component-based UI**: Reusable React Native components
- **State management**: Zustand for global state, Tanstack Query for server state