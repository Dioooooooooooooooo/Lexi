# LexiLearner Documentation

## Overview

LexiLearner is a modern language learning platform built with TypeScript, featuring automated API generation and type-safe client development.

## Architecture

- **Backend**: NestJS + Kysely + PostgreSQL
- **Mobile**: React Native + Expo + Tanstack Query  
- **API**: Code-first with automatic OpenAPI generation
- **Client**: Auto-generated type-safe React Native client

## API Development Workflow

### Code-First Approach
1. **Write NestJS Controllers** with Swagger decorators
2. **Generate OpenAPI Spec** automatically from code
3. **Generate React Native Client** with type safety
4. **Stay Always in Sync** - no manual API maintenance

### Commands
```bash
npm run openapi:spec     # Generate OpenAPI from NestJS
npm run openapi:client   # Generate React Native client
npm run openapi:docs     # Generate both spec and client
```

## Development Guide

### Getting Started
1. Install dependencies: `npm run install:all`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start development: `npm run dev`

### Project Structure
```
backend/          # NestJS API server
├── src/modules/  # Feature modules (auth, classrooms, etc.)
├── src/database/ # Database schemas and migrations
└── src/common/   # Shared utilities

mobile/           # React Native application
├── app/          # Expo Router screens
├── components/   # Reusable UI components
├── services/     # API client (auto-generated)
└── stores/       # State management (Zustand)
```

### API Documentation
- **Development**: http://localhost:3000/docs
- **Swagger UI**: Interactive API testing
- **Auto-generated**: Always reflects current code

## Features

### Core Functionality
- 🔐 **Authentication** - JWT with refresh tokens
- 👥 **Classroom Management** - Create, join, manage classrooms
- 🎮 **Interactive Minigames** - Language learning games
- 📖 **Reading Materials** - Content management and assignments
- 🏆 **Achievements** - Progress tracking and rewards

### Technical Features
- 📱 **Cross-platform** - iOS and Android support
- 🔄 **Auto-sync** - API client always matches backend
- 🎯 **Type-safe** - End-to-end TypeScript safety
- ⚡ **Performance** - Optimized queries with Kysely
- 🧪 **Testable** - Comprehensive testing strategy

## Deployment

### Backend (NestJS)
- **Production**: Vercel serverless functions
- **Database**: PostgreSQL (Railway/Supabase)
- **Environment**: Node.js 18+

### Mobile App
- **Distribution**: Expo EAS Build
- **Platforms**: iOS App Store, Google Play Store
- **Updates**: Over-the-air with Expo Updates

## Contributing

### Development Setup
1. Clone repository
2. Install dependencies: `npm run install:all`
3. Set up local PostgreSQL
4. Copy `.env.example` to `.env` in backend/
5. Start development: `npm run dev`

### Code Standards
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Testing**: Jest for backend, Expo testing for mobile
- **Commits**: Conventional commit format

### Adding New Features
1. **Backend**: Create NestJS module with Swagger decorators
2. **Generate**: Run `npm run openapi:client` to update client
3. **Frontend**: Use generated Tanstack Query hooks
4. **Test**: Verify functionality end-to-end

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [Kysely Documentation](https://kysely.dev/)
- [Tanstack Query Documentation](https://tanstack.com/query/)

---

*🚀 **Modern TypeScript Stack** - Code-first API development with automatic client generation*