# LexiLearner - Project Overview

## Purpose
LexiLearner is a modern language learning platform built with TypeScript that provides:
- Classroom management for teachers and students
- Interactive minigames for language learning
- Reading comprehension tools and materials
- Progress tracking and achievements system
- JWT-based authentication with refresh tokens

## Architecture
- **Monorepo structure** using pnpm workspaces
- **Backend**: NestJS + TypeScript + Kysely + PostgreSQL
- **Mobile**: React Native + Expo + TypeScript + Tanstack Query + Zustand
- **Code-first API development** with automatic OpenAPI generation
- **Type-safe client generation** ensures frontend/backend always in sync

## Key Technical Features
- Auto-generated type-safe API client from NestJS code
- Cross-platform mobile app (iOS/Android)
- End-to-end TypeScript safety
- Performance-optimized database queries with Kysely
- Over-the-air updates via Expo Updates

## Current Status
Active migration from C# to TypeScript stack with focus on maintaining backward compatibility and testing against existing mobile app functionality.