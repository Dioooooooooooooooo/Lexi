# LexiLearner - Code Style & Conventions

## TypeScript Configuration
### Backend (NestJS)
- **Target**: ES2021
- **Module**: CommonJS
- **Decorators**: Enabled (experimentalDecorators: true)
- **Strict mode**: Partially enabled (strictNullChecks: false, noImplicitAny: false)
- **Path mapping**: `@/*` → `./src/*`

### Mobile (React Native)
- **Extends**: expo/tsconfig.base
- **Strict mode**: Fully enabled (strict: true)
- **Path mapping**: `@/*` → `./*`, `~/*` → `*`

## ESLint Configuration
### Backend
- Uses typescript-eslint recommended + type-checked rules
- Prettier integration enabled
- Custom rules:
  - `@typescript-eslint/no-explicit-any`: off
  - `@typescript-eslint/no-floating-promises`: warn
  - `@typescript-eslint/no-unsafe-argument`: warn

### Mobile
- Uses Expo's default ESLint configuration
- Prettier integration for consistent formatting

## Naming Conventions
- **Files/Directories**: kebab-case or camelCase (following respective framework conventions)
- **Classes**: PascalCase (e.g., `AppController`, `UserService`)
- **Interfaces/Types**: PascalCase with descriptive names
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Database**: Uses Kysely-generated types

## Code Organization
### Backend Structure
```
src/
├── app/              # Feature modules
├── common/           # Shared utilities
├── configuration/    # App configuration
├── database/         # DB schemas & migrations
├── decorators/       # Custom decorators
├── filters/          # Exception filters
└── validators/       # Custom validators
```

### Mobile Structure
```
mobile/
├── app/              # Expo Router screens
├── components/       # Reusable UI components
├── constants/        # App constants
├── context/          # React contexts
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
├── models/           # Data models
├── services/         # API services (auto-generated)
├── stores/           # Zustand stores
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## API Development Conventions
- **Code-first approach**: Write NestJS controllers with Swagger decorators
- **DTOs**: Use class-validator decorators for validation
- **Response formatting**: Consistent API response structure
- **Error handling**: Global exception filters
- **Authentication**: JWT with refresh token rotation

## Styling Conventions (Mobile)
- **Primary styling**: Tailwind CSS via NativeWind
- **Component library**: Custom components + React Native Paper
- **Responsive design**: Mobile-first approach
- **Dark/Light mode**: System-based theme switching

## Git Conventions
- **Commits**: Conventional commit format (feat:, fix:, docs:, etc.)
- **Branches**: feature/, bugfix/, hotfix/ prefixes
- **Pre-commit hooks**: Lint-staged runs ESLint + Prettier on staged files
- **PR requirements**: Include migration progress updates