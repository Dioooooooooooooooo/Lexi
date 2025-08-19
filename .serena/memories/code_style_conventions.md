# Code Style and Conventions

## General Formatting (Prettier)
- **Trailing Commas**: Always (all)
- **Tab Width**: 2 spaces
- **Semicolons**: Always
- **Quotes**: Double quotes
- **Print Width**: 80 characters
- **Bracket Spacing**: true
- **Arrow Parens**: avoid

## TypeScript Configuration
- **Strict Mode**: Enabled
- **Path Mapping**: 
  - `@/*` maps to project root
  - `~/*` maps to everything
- **Base URL**: `./`

## Component Conventions

### React Native Components
- Use `React.forwardRef` for components that need ref forwarding
- Export interfaces for component props (e.g., `ButtonProps`, `SearchBarProps`)
- Components use Expo Router for navigation
- File-based routing in `app/` directory

### Styling Patterns
- Primary styling with NativeWind/Tailwind classes
- Custom color palette defined in tailwind.config.js
- Class Variance Authority (CVA) for component variants
- `cn()` utility function for conditional classes
- Custom design tokens for colors, spacing, and typography

### Naming Conventions
- **Components**: PascalCase (e.g., `SearchBar`, `Button`)
- **Files**: camelCase for utilities, PascalCase for components
- **Interfaces**: Descriptive names with Props suffix (e.g., `ButtonProps`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `DARK_THEME`)

## Backend Conventions (NestJS)
- **Modules**: Feature-based organization under `src/app/`
- **Controllers**: RESTful endpoints with OpenAPI decorators
- **Services**: Business logic separation
- **DTOs**: Class-based with validation decorators
- **Database**: Kysely for type-safe queries

## Linting Rules (ESLint)
- **TypeScript**: Recommended + type-checked rules
- **Prettier**: Integrated formatting
- **Custom Rules**:
  - `@typescript-eslint/no-explicit-any`: error
  - `@typescript-eslint/no-floating-promises`: warn
  - `@typescript-eslint/no-unsafe-argument`: warn

## Import Organization
- Absolute imports preferred with path mapping
- Group imports: external libraries, internal modules, relative imports