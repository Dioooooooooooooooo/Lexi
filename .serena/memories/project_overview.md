# Babolat LexiLearner Project Overview

## Project Purpose
LexiLearner is a language learning mobile application built with Expo/React Native. The app appears to focus on vocabulary learning through various minigames and classroom management features. The project is structured as a monorepo with both mobile frontend and backend API components.

## Project Structure
```
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── app/      # Feature modules (auth, classrooms, minigames, pupils)
│   │   ├── common/   # Shared utilities
│   │   ├── database/ # Database configuration and types
│   │   └── ...
├── mobile/           # React Native/Expo mobile app
│   ├── app/          # File-based routing (Expo Router)
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Generated API client and utilities
│   ├── stores/       # State management (Zustand)
│   └── ...
├── docs/             # Documentation
└── scripts/          # Build/deployment scripts
```

## Key Features
- Mobile language learning app with minigames
- Classroom management system
- User authentication and profiles
- API integration with OpenAPI spec generation
- Dark/light theme support
- Offline capabilities

## Monorepo Setup
- Uses pnpm workspace with packages: backend, mobile
- Shared dependencies and configuration at root level
- Cross-platform development (iOS, Android, Web)