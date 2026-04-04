# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ConchClub is a full-stack web app for a movie-watching club. Members submit movies each season, vote on a selection, and track watch history. It uses a **Spring Boot 3.2.1** backend and a **React 19 + Vite** frontend, with **MongoDB** as the database.

## Commands

### Backend (Gradle + Spring Boot)

```bash
# Run locally (requires src/main/resources/application-local.yml)
./gradlew bootRun

# Run tests
./gradlew test

# Build JAR
./gradlew build
```

### Frontend (npm + Vite)

```bash
cd client

npm install        # Install dependencies
npm run dev        # Dev server on port 3000
npm run build      # Production build
npm test           # Run tests (Vitest)
npm run test:ui    # Tests with UI
npm run lint       # ESLint
```

### Full Stack (Docker Compose)

```bash
docker-compose up   # Starts backend (8080), frontend (3000), MongoDB (27017)
```

### Local Configuration

The backend requires `src/main/resources/application-local.yml` (not committed). Required fields: `jwt.secret`, `google.credentials.path`, `tmdb.api.key`. See `application.yml` for the production schema.

## Architecture

### Backend (`src/main/java/com/conchclub/`)

```
config/        # Spring Security, JWT filter, CORS, app config
controller/    # REST endpoints — Auth, Season, Submission, Admin
service/       # Business logic — Auth, Season, TMDB integration
model/         # Domain objects — User, Season, Submission, Role
dto/           # Context-specific DTOs per endpoint perspective
repository/    # Spring Data MongoDB repositories
```

Spring profiles control environment behavior:
- `local` — permissive security, mock data, open endpoints
- `prod` (default) — strict security, real data, JWT enforced

Authentication is JWT-based. Tokens are validated by a servlet filter before hitting controllers.

### Frontend (`client/src/`)

```
pages/             # Full-page views: Login, Register, Dashboard, AdminPanel
components/        # Feature components grouped by domain
  Dashboard/       # Season submission & official selection UI
  MovieCard/       # Flip-card movie display
  Season/          # Season management UI
  UI/              # Generic reusable UI components
lib/               # API client (Axios) and utility helpers
App.jsx            # Root with React Router v7 routes
```

API calls go through a centralized Axios client in `lib/`. Authentication tokens are managed client-side and sent in request headers.

## Coding Standards (from AGENTS.md)

These rules apply to all code written in this repo:

1. **No comments** — Code must be self-documenting via descriptive names. Comments are strictly forbidden.
2. **No `var` in Java** — Always use explicit types.
3. **No TODO comments** — Use Spring profiles to handle environment-specific logic instead.
4. **Context-specific DTOs and endpoints** — No "Swiss Army Knife" objects. Create separate DTOs per use case (e.g., `MysteryTicketDto` vs `TicketDto`) and separate endpoints per perspective (e.g., `/api/admin/tickets` vs `/api/season/tickets/me`). This prevents accidental data leaks.
5. **Avoid nulls** — Use `Optional` instead of nullable fields whenever possible.
6. **Component composition** — Prefer small, named React components over deeply nested JSX with complex conditional logic.

## Deployment

Deployed to **Google Cloud Run** (backend + frontend as separate services) with **MongoDB Atlas** and secrets managed via **GCP Secret Manager**. See `aux_setup/DEPLOYMENT.md` for full deployment instructions.

Gradle tasks for deployment (Windows-specific wrappers):
- `./gradlew buildAndPushBE` / `./gradlew buildAndPushFE` — Build and push Docker images
- `./gradlew deployBE` / `./gradlew deployFE` — Deploy to Cloud Run
