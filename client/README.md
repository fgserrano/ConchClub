# Conch Club — Frontend

React 19 + Vite client for Conch Club. For full-stack setup (Docker, MongoDB, backend config), see the [root README](../README.md).

## Running

The client is normally started as part of `docker compose up` from the repo root, which bind-mounts this directory so hot reload still applies. To run it standalone against a backend on port 8080:

```bash
npm install && npm run dev
```

Vite serves on port 3000 with `host: true`, so the dev server is reachable from outside the container.

## Scripts

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Dev server on http://localhost:3000     |
| `npm run build`    | Production build to `dist/`             |
| `npm run preview`  | Serve the production build locally      |
| `npm run lint`     | ESLint                                  |
| `npm test`         | Vitest (jsdom) — watch mode             |
| `npm run test:ui`  | Vitest with the browser UI              |

## Environment

| Variable                   | Default                      | Used by                                            |
| -------------------------- | ---------------------------- | -------------------------------------------------- |
| `VITE_API_URL`             | `http://<hostname>:8080/api` | [src/lib/api.js](src/lib/api.js)                   |
| `VITE_SEARCH_DEBOUNCE_MS`  | `500`                        | [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx) |

`.env` deliberately leaves `VITE_API_URL` unset so the axios base URL falls back to the current hostname on port 8080 — correct both on the host and in Docker. `.env.production` pins it to the deployed Cloud Run backend and is git-ignored.

## Structure

```
src/
├── pages/          Route-level screens (Login, Register, Dashboard, AdminPanel)
├── components/
│   ├── Dashboard/  MySubmission, OfficialSelection, SubmissionForm
│   ├── MovieCard/  Flip card — MovieCard, FrontFace, BackFace, MovieRow
│   ├── Season/     CurrentSeason, NewSeasonForm, SeasonActions
│   ├── UI/         Shared primitives (ConfirmDialog)
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
└── lib/
    ├── api.js      Axios instance + auth interceptors
    └── utils.js    `cn()` — clsx + tailwind-merge
```

## Auth

The JWT and role are held in `localStorage`. [src/lib/api.js](src/lib/api.js) attaches the token as a bearer header on every request, and its response interceptor clears the token and redirects to `/login` on a 401 — guarded so it doesn't loop when already on the login page.

Route protection lives in [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx): it renders an `<Outlet />` when a token is present, and takes an optional `role` prop to gate `/admin` behind `ADMIN`. This is a UX guard only — the backend enforces authorization independently.

## Conventions

Per [AGENTS.md](../AGENTS.md): no comments in code — favor descriptive names — and compose screens from small named components rather than deeply nested conditional markup.

## Tests

Vitest with `globals: true` and the jsdom environment, configured in [vite.config.js](vite.config.js). `@testing-library/jest-dom` matchers are registered in [src/setupTests.js](src/setupTests.js). Tests sit next to the component they cover as `*.test.jsx`.

## Docker

[../docker/Dockerfile.frontend](../docker/Dockerfile.frontend) is multi-stage: `development` runs the Vite dev server (used by compose), while `production` builds to `dist/` and serves it from nginx on port 80 using [nginx.conf](nginx.conf).
