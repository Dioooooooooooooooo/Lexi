# Codebase Structure

## Root Directory
```
D:\Babolat\
├── LexiLearner/lexilearner/          # React Native frontend
├── lexilearner-backend/              # NestJS backend
└── run-serena.bat                    # Utility script
```

## Backend Structure (lexilearner-backend/)
```
lexilearner-backend/
├── src/
│   ├── modules/                      # Feature modules
│   │   ├── auth/                     # Authentication module
│   │   ├── classrooms/               # Classroom management
│   │   ├── minigames/                # Game-related functionality
│   │   └── pupils/                   # Student management
│   ├── common/                       # Shared utilities
│   ├── configuration/                # App configuration
│   ├── database/                     # Database setup/migrations
│   ├── decorators/                   # Custom decorators
│   ├── filters/                      # Exception filters
│   ├── validators/                   # Custom validators
│   ├── app.controller.ts             # Main app controller
│   ├── app.module.ts                 # Root module
│   ├── app.service.ts                # Main app service
│   └── main.ts                       # Application bootstrap
├── test/                             # E2E tests
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript config
├── eslint.config.mjs                 # ESLint configuration
├── nest-cli.json                     # NestJS CLI config
└── vercel.json                       # Deployment config
```

## Frontend Structure (LexiLearner/lexilearner/)
```
LexiLearner/lexilearner/
├── app/                              # Expo Router pages
│   ├── (auth)/                       # Authentication screens
│   ├── (tabs)/                       # Tab navigation screens
│   ├── classroom/                    # Classroom features
│   ├── content/                      # Content management
│   ├── minigames/                    # Game screens
│   ├── profile/                      # User profile
│   ├── index.tsx                     # Home/entry screen
│   └── _layout.tsx                   # Root layout
├── components/                       # Reusable UI components
├── constants/                        # App constants
├── context/                          # React contexts
├── hooks/                            # Custom React hooks
├── lib/                              # Library configurations
├── models/                           # TypeScript interfaces/types
├── services/                         # API services
├── stores/                           # Zustand state stores
├── utils/                            # Utility functions
├── assets/                           # Images, fonts, etc.
├── android/                          # Android-specific code
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript config
├── tailwind.config.js                # Tailwind CSS config
├── metro.config.js                   # Metro bundler config
├── app.json                          # Expo configuration
└── eas.json                          # Expo Application Services config
```

## Key Files
- **Backend Entry**: `lexilearner-backend/src/main.ts`
- **Frontend Entry**: `LexiLearner/lexilearner/index.js`
- **API Documentation**: Available at http://localhost:3000/docs when backend is running
- **Database**: PostgreSQL with Kysely query builder
- **State Management**: Zustand stores in frontend
- **Styling**: Tailwind CSS via NativeWind for React Native