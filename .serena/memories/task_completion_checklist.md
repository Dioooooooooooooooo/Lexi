# Task Completion Checklist

## Pre-Development
- [ ] Understand the feature/bug requirements
- [ ] Check existing code patterns and conventions
- [ ] Identify affected components/modules
- [ ] Plan implementation approach

## During Development
- [ ] Follow existing code style and conventions
- [ ] Use TypeScript strict typing
- [ ] Implement proper error handling
- [ ] Add appropriate validation (backend)
- [ ] Follow component patterns (frontend)

## Code Quality Checks
- [ ] Run `pnpm run lint` in affected package
- [ ] Run `pnpm run format` in affected package
- [ ] Ensure no TypeScript errors
- [ ] Test functionality manually
- [ ] Run `pnpm test` if tests exist

## API Development (Backend)
- [ ] Update OpenAPI documentation
- [ ] Validate request/response DTOs
- [ ] Check database schema changes
- [ ] Test with API client tools

## Mobile Development (Frontend)
- [ ] Test on different screen sizes
- [ ] Verify dark/light theme compatibility
- [ ] Check navigation flow
- [ ] Test on iOS/Android if possible
- [ ] Regenerate API client if backend changed:
  ```bash
  pnpm run openapi:spec
  pnpm run openapi:client
  ```

## Final Verification
- [ ] Code builds successfully
- [ ] No linting errors
- [ ] No formatting issues
- [ ] Functionality works as expected
- [ ] No console errors/warnings

## Git Workflow
- [ ] Stage changes: `git add .`
- [ ] Commit with descriptive message: `git commit -m "feat/fix: description"`
- [ ] Push to branch: `git push`

## Documentation Updates (if needed)
- [ ] Update README if new features
- [ ] Update API documentation
- [ ] Add inline code comments for complex logic