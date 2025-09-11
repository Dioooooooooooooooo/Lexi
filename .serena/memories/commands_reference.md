# Commands Reference

## 🚀 Daily Development

```bash
# Start everything
pnpm dev                    # Backend + Mobile
pnpm dev:backend           # NestJS server only (:3000)
pnpm dev:mobile           # Expo dev server only

# Quick quality check
pnpm lint && pnpm test     # Lint + test all projects
```

## 🔄 API Workflow (After NestJS Changes)

```bash
# 1. Ensure backend is running
cd backend && pnpm run start:dev

# 2. Regenerate TypeScript client
cd mobile && pnpm openapi:spec && pnpm openapi:client

# 3. Create React Query hooks manually (follow existing patterns)
# 4. Export new hooks in hooks/index.ts
```

**⚠️ Important:**
- Backend must be running on localhost:3000 before generating spec!
- `openapi:client` only generates raw TypeScript client - hooks are manual
- Generated files overwrite `mobile/hooks/api/requests/`

## 🧪 Testing & Quality

```bash
# All projects
pnpm test                  # Run all tests
pnpm lint                  # Lint all projects  
pnpm build                 # Build all projects

# Specific projects
pnpm test:backend          # NestJS tests only
pnpm test:mobile          # React Native tests only

# Coverage
cd backend && pnpm run test:cov
```

## 📱 Mobile Specific

```bash
cd mobile
pnpm start                 # Expo dev server
pnpm run android          # Run on Android device
pnpm run ios              # Run on iOS device
```

## 🛠️ Troubleshooting

### API Generation Issues
```bash
# Check backend status
curl http://localhost:3000/docs

# Force regenerate
rm mobile/swagger.json && pnpm openapi:spec && pnpm openapi:client
```

### Build Issues
```bash
# Clear all caches
cd mobile && pnpm exec expo r -c
pnpm clean

# Nuclear option
rm -rf node_modules pnpm-lock.yaml && pnpm install
```

### Database Issues
```bash
cd backend && pnpm run generate:schema    # Regenerate Kysely types
```

## 🔧 Utility Commands

```bash
pnpm clean               # Clean all build artifacts
pnpm install             # Install all dependencies
pnpm install:backend     # Backend dependencies only
pnpm install:mobile      # Mobile dependencies only
```

## 📝 Quick Reference

| Task | Command |
|------|---------|
| Start development | `pnpm dev` |
| Check code quality | `pnpm lint && pnpm test` |
| Regenerate API client | `pnpm openapi:spec && pnpm openapi:client` |
| Clear caches | `pnpm clean` |
| Run on device | `cd mobile && pnpm run android/ios` |