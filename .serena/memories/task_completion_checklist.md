# LexiLearner - Task Completion Checklist

## Code Quality & Standards
- [ ] **Linting**: Run `npm run lint` to check all code
- [ ] **Formatting**: Ensure Prettier formatting is applied
- [ ] **Type checking**: Verify TypeScript compilation passes
- [ ] **ESLint rules**: Address any linting warnings/errors

## API Development (if backend changes made)
- [ ] **Swagger decorators**: Ensure all endpoints have proper OpenAPI documentation
- [ ] **Generate OpenAPI spec**: Run `npm run openapi:spec`
- [ ] **Generate client**: Run `npm run openapi:client` to update mobile API client
- [ ] **Type safety**: Verify generated client types are used correctly in mobile app

## Testing Requirements
- [ ] **Unit tests**: Run `npm run test:backend` for backend changes
- [ ] **Mobile tests**: Run `npm run test:mobile` for frontend changes
- [ ] **Integration tests**: Run end-to-end tests if available
- [ ] **Manual testing**: Verify functionality works as expected

## Backend-Specific Checklist
- [ ] **Database changes**: Update Kysely types if schema changed (`pnpm run generate:schema`)
- [ ] **Validation**: Ensure DTOs have proper validation decorators
- [ ] **Error handling**: Check that exceptions are properly handled
- [ ] **Authentication**: Verify JWT guards are applied where needed
- [ ] **Performance**: Check for N+1 queries or inefficient database operations

## Mobile-Specific Checklist
- [ ] **Component testing**: Test components on both iOS and Android if possible
- [ ] **State management**: Verify Zustand stores are updated correctly
- [ ] **Navigation**: Ensure routing works properly with Expo Router
- [ ] **Styling**: Check Tailwind classes render correctly with NativeWind
- [ ] **API integration**: Verify Tanstack Query hooks work with generated client

## Documentation Updates
- [ ] **API docs**: Auto-generated at http://localhost:3000/docs should reflect changes
- [ ] **README updates**: Update if new commands or setup steps are needed
- [ ] **Migration notes**: Document progress if part of C# → TypeScript migration

## Pre-Commit Requirements
- [ ] **Conventional commits**: Follow format (feat:, fix:, docs:, etc.)
- [ ] **Lint-staged**: Pre-commit hooks should pass automatically
- [ ] **No secrets**: Ensure no API keys or sensitive data in code
- [ ] **Clean commit**: Remove debug logs, commented code, console.logs

## Deployment Readiness
- [ ] **Build verification**: Run `npm run build` to ensure production build works
- [ ] **Environment variables**: Verify all required env vars are documented
- [ ] **Migration compatibility**: Ensure changes work with existing mobile app
- [ ] **Backward compatibility**: Don't break existing API contracts without versioning

## Windows Development Notes
- [ ] **Path separators**: Use forward slashes in cross-platform code
- [ ] **File permissions**: Verify scripts have proper execution permissions
- [ ] **Line endings**: Ensure consistent LF line endings (handled by .gitattributes)

## Final Verification
- [ ] **Full development workflow**: `npm run dev` should start both apps successfully
- [ ] **API generation workflow**: OpenAPI generation should work end-to-end
- [ ] **No breaking changes**: Existing functionality should continue working
- [ ] **Performance check**: No significant performance regressions introduced