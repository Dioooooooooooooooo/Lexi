# LexiLearner Codebase Structure

## Root Level Structure
```
lexilearner/
├── backend/                 # NestJS API server
├── mobile/                  # React Native/Expo app
├── docs/                    # Project documentation
├── scripts/                 # API generation automation
├── package.json            # Monorepo workspace config
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── .prettierrc.json        # Global Prettier config
└── API_MIGRATION_PROGRESS.md # Migration tracking
```

## Backend Structure (NestJS)
```
backend/
├── src/
│   ├── app/                # Feature modules
│   │   ├── auth/          # Authentication & JWT
│   │   │   ├── dto/       # Auth DTOs
│   │   │   ├── entities/  # Auth entities
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── role-guard.ts
│   │   ├── classrooms/    # Classroom management
│   │   │   ├── dto/       # Classroom DTOs
│   │   │   ├── entities/  # Classroom entities
│   │   │   ├── classrooms.controller.ts
│   │   │   ├── classrooms.service.ts
│   │   │   └── classrooms.module.ts
│   │   ├── pupils/        # Student management
│   │   │   ├── dto/       # Pupil DTOs
│   │   │   ├── entities/  # Pupil entities
│   │   │   ├── pupils.controller.ts
│   │   │   ├── pupils.service.ts
│   │   │   └── pupils.module.ts
│   │   └── minigames/     # Game functionality
│   │       ├── dto/       # Minigame DTOs
│   │       ├── entities/  # Minigame entities
│   │       ├── minigames.controller.ts
│   │       ├── minigames.service.ts
│   │       └── minigames.module.ts
│   ├── common/            # Shared utilities
│   ├── configuration/     # App configuration
│   ├── database/          # DB schema & types
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Exception filters
│   ├── validators/        # Custom validators
│   ├── app.module.ts      # Main app module
│   └── main.ts           # Application bootstrap
├── test/                  # E2E tests
├── package.json          # Backend dependencies
├── nest-cli.json         # NestJS CLI config
├── tsconfig.json         # TypeScript config
└── eslint.config.mjs     # ESLint configuration
```

## Mobile Structure (React Native/Expo)
```
mobile/
├── app/                   # Expo Router pages (file-based routing)
├── components/            # Reusable UI components
├── lib/
│   └── hooks/            # API hooks & utilities
│       ├── requests/     # Auto-generated API client
│       │   ├── services.gen.ts    # Generated service classes
│       │   ├── types.gen.ts       # Generated TypeScript types
│       │   ├── schemas.gen.ts     # Generated JSON schemas
│       │   └── core/             # HTTP client infrastructure
│       └── useApiHooks.ts        # Manual TanStack Query hooks
├── stores/               # Zustand state stores
├── types/                # TypeScript type definitions
├── utils/                # Helper functions
├── constants/            # App constants
├── context/              # React contexts
├── assets/               # Images, fonts, etc.
├── package.json          # Mobile dependencies
├── app.json             # Expo configuration
├── tailwind.config.js   # Tailwind CSS config
├── tsconfig.json        # TypeScript config
└── swagger.json         # Downloaded OpenAPI spec
```

## Key Configuration Files

### Root Level
- **package.json**: Monorepo scripts, workspaces, shared devDeps
- **pnpm-workspace.yaml**: Workspace configuration
- **.prettierrc.json**: Code formatting rules

### Backend
- **nest-cli.json**: NestJS CLI configuration
- **tsconfig.json**: TypeScript compiler options
- **eslint.config.mjs**: ESLint rules and plugins
- **vercel.json**: Deployment configuration

### Mobile  
- **app.json**: Expo app configuration
- **tailwind.config.js**: Tailwind CSS customization
- **metro.config.js**: Metro bundler configuration
- **babel.config.js**: Babel transpilation

## API Generation Workflow Files

### Scripts Directory
```
scripts/
├── generate-openapi-spec.js    # Extract spec from NestJS
├── generate-client.js          # Generate TypeScript client
└── compare-apis.js            # Migration comparison tool
```

### Generated Files (Auto-created)
```
mobile/
├── swagger.json               # Downloaded OpenAPI spec
└── lib/hooks/requests/        # Generated TypeScript client
    ├── services.gen.ts        # Service classes
    ├── types.gen.ts          # Type definitions
    ├── schemas.gen.ts        # JSON schemas
    └── core/                 # HTTP infrastructure
```

## Database Structure
- **Type**: PostgreSQL
- **Query Builder**: Kysely (type-safe SQL)
- **Schema Generation**: `kysely-codegen` generates TypeScript types
- **Location**: `backend/src/database/db.d.ts`

## Testing Structure
```
backend/test/              # E2E tests
backend/src/**/*.spec.ts   # Unit tests (co-located)

mobile/__tests__/          # Jest tests
mobile/**/*.test.ts        # Component tests (co-located)
```

## Documentation Structure
```
docs/                      # Project documentation
├── README.md             # Documentation overview
└── [additional docs]     # Architecture, APIs, etc.
```

## Import Patterns

### Backend
- Absolute imports using `@/` alias (maps to `src/`)
- Module barrel exports for cleaner imports
- Strict TypeScript compilation

### Mobile
- Relative imports for local files
- Absolute imports for shared utilities
- Generated API client imports from `lib/hooks/requests`

## Build Outputs
```
backend/dist/              # NestJS compiled output
mobile/.expo/             # Expo build cache
mobile/node_modules/      # Dependencies
backend/node_modules/     # Dependencies
```