# Task Completion Checklist

## When Working on Backend (lexilearner-backend/)
After making changes, run these commands in order:

1. **Linting**: `pnpm run lint`
   - Fixes code style issues automatically
   - Ensures ESLint rules compliance

2. **Type Checking**: Built into the linting process via typescript-eslint

3. **Testing**: `pnpm run test`
   - Run unit tests to ensure no regressions
   - For specific changes, consider running relevant test suites

4. **Build Verification**: `pnpm run build`
   - Ensures the application compiles correctly
   - Catches TypeScript compilation errors

## When Working on Frontend (LexiLearner/lexilearner/)
After making changes, run these commands:

1. **Linting**: `npm run lint`
   - Uses Expo's built-in linting configuration

2. **Type Checking**: TypeScript compiler runs automatically with Expo
   - Check the terminal for any TypeScript errors

3. **Testing**: `npm run test`
   - Run Jest tests if available

## Before Committing
- Ensure both frontend and backend lint without errors
- Verify all tests pass
- Check that the build process completes successfully
- Test key functionality manually if significant changes were made

## API Development Specific
- Update Swagger documentation if API endpoints change
- Verify API documentation at http://localhost:3000/docs
- Test API endpoints manually or with automated tests
- Ensure database migrations are created if schema changes

## Mobile Development Specific
- Test on multiple platforms (iOS/Android) when possible
- Verify responsive design on different screen sizes
- Check for React Native specific warnings in the console
- Ensure navigation flows work correctly