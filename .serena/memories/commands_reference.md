# Commands Reference

## Daily Commands

### Start Development
```bash
pnpm dev                    # Start all (backend + mobile)
pnpm dev:backend           # NestJS server on :3000
pnpm dev:mobile           # Expo dev server
pnpm dev:mobile-server    # Expo server only
```

### Quality Assurance (Run After Changes)
```bash
pnpm lint                  # Lint all projects
pnpm test                  # Run all tests
pnpm build                 # Build all projects
```

### API Generation
```bash
pnpm openapi:spec         # Generate spec from NestJS
pnpm openapi:client       # Generate TypeScript client  
pnpm openapi:docs         # Generate both
```

## Individual Project Commands

### Backend
```bash
cd backend
pnpm run start:dev        # Dev server with watch
pnpm run test             # Jest unit tests
pnpm run test:e2e         # End-to-end tests
pnpm run lint             # ESLint + Prettier
pnpm run build            # Production build
```

### Mobile  
```bash
cd mobile
pnpm start               # Expo dev server
pnpm run android         # Run on Android
pnpm run ios             # Run on iOS  
pnpm test                # Jest tests
pnpm run lint            # ESLint
```

## Testing Commands
```bash
# All tests
pnpm test

# Specific tests
pnpm test:backend        # NestJS tests
pnpm test:mobile         # React Native tests

# Coverage
cd backend && pnpm run test:cov
```

## Troubleshooting

### API Generation Issues
```bash
# Check backend is running
curl http://localhost:3000/docs

# Clear and regenerate
rm mobile/swagger.json
pnpm openapi:spec
pnpm openapi:client
```

### Build Issues
```bash
# Clear caches
cd mobile && pnpm exec expo r -c    # Clear Expo cache
pnpm clean                          # Clean all build artifacts

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Database Issues
```bash
cd backend
pnpm run generate:schema    # Regenerate Kysely types
```

## Utility Commands
```bash
pnpm clean               # Clean all build artifacts
pnpm install             # Install all dependencies
pnpm install:backend     # Backend only
pnpm install:mobile      # Mobile only
```

## Windows Notes
- Use PowerShell or Command Prompt
- All scripts are cross-platform compatible
- Git commands work normally