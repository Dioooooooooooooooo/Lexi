# LexiLearner Project Overview

## Purpose
LexiLearner is a language learning application with both frontend and backend components:

- **Frontend**: A React Native mobile application built with Expo, designed for cross-platform (iOS/Android) deployment
- **Backend**: A NestJS REST API server that provides data and authentication services

## Architecture
The project consists of two main parts:
1. `LexiLearner/lexilearner/` - React Native frontend (Expo-based)
2. `lexilearner-backend/` - NestJS backend API

## Key Features (Based on Module Structure)
- User authentication system
- Classroom management
- Minigames for language learning
- Pupil/student management
- Profile management

## Tech Stack Summary
**Frontend:**
- React Native + Expo
- TypeScript
- Tailwind CSS (via NativeWind)
- React Query for data fetching
- Zustand for state management
- Axios for HTTP requests

**Backend:**
- NestJS (Node.js framework)
- TypeScript
- PostgreSQL (via Kysely query builder)
- JWT Authentication
- Swagger/OpenAPI documentation
- bcrypt for password hashing

## Development Environment
- System: Windows
- Package managers: pnpm (backend), npm (frontend)
- Both projects are configured with TypeScript strict mode