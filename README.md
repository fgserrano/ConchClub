# 🐚 Conch Club

Conch Club is a specialized web application designed to manage and facilitate a movie club. It streamlines the process of movie submissions, themed seasons, and the random selection of movies for weekly screenings.

## 🚀 Key Features

- **Season Management**: Admins create themed seasons and lock/unlock them to open or close submissions.
- **Movie Submissions**: Members search TMDB and submit a movie for the active season, then update it while the season is unlocked.
- **Mystery Submissions**: Other members' picks stay hidden until the reveal, served through a separate DTO so unrevealed data never reaches the client.
- **Winner Reveal**: The admin UI picks a submission at random, then posts that choice to the backend, which marks it as selected for the season.
- **Security**: JWT authentication with role-based access control (`ADMIN` / `MEMBER`) and invite-code-gated registration.

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: MongoDB
- **Security**: Spring Security + JJWT
- **Integrations**: TMDB API

### Frontend
- **Framework**: React 19 + Vite 7
- **Routing**: React Router 7
- **HTTP**: Axios
- **Styling**: Tailwind CSS 4, Framer Motion (animations)
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

## 🏁 Getting Started

### Prerequisites
- Docker (for the recommended path), or Java 17 + Node.js LTS to run on the host
- A TMDB API key

### Configuration

Two files hold secrets, and both are git-ignored. Create them before the first run.

**1. `src/main/resources/application-local.yml`** — used when running the backend under the `local` profile:

```yaml
# Local configuration (DO NOT COMMIT THIS FILE)
spring:
  config:
    activate:
      on-profile: local
  data:
    mongodb:
      uri: mongodb://localhost:27017/conchclub
      database: ${SPRING_DATA_MONGODB_DATABASE:conchclub}

jwt:
  secret: your_base64_encoded_jwt_secret

tmdb:
  api:
    key: your_tmdb_read_access_token

user:
  registration:
    invite-code: your_invite_code
```

**2. `.env`** — consumed by `docker-compose.yml` and injected into the backend container. Copy `.env.example` and fill it in. Note that the Mongo URI here targets the compose service, not localhost:

```bash
SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/conchclub
```

Environment variables take precedence over `application-local.yml`, which is why the same backend image works in both setups.

**TMDB setup**: register at [themoviedb.org](https://www.themoviedb.org/documentation/api) and use your API Key (v3) or Read Access Token (v4).

### Running with Docker (recommended)

```bash
docker compose up --build
```

This brings up all three services:

| Service  | URL / Port              |
| -------- | ----------------------- |
| Frontend | http://localhost:3000   |
| Backend  | http://localhost:8080   |
| MongoDB  | `localhost:27017`       |

The client directory is bind-mounted, so Vite hot reload works against the running container.

### Running on the host

Start only the database, then run each half yourself:

```bash
docker compose up -d mongo
```

Backend — the `local` profile is required. `application.yml` is made of placeholders with no defaults, so the context fails to start without it:

```bash
SPRING_PROFILES_ACTIVE=local ./gradlew bootRun
```

Frontend, in a second terminal:

```bash
cd client && npm install && npm run dev
```

`client/.env` intentionally omits `VITE_API_URL` so the client falls back to `http://<hostname>:8080/api`, which is correct for both setups.

### Logging in

`mongo-init/mongo-init.js` seeds an admin account and a starter season on first run:

- **Username**: `admin`
- **Password**: `password`

That script only executes when the `mongo_data` volume is initialized. To re-seed, drop the volume with `docker compose down -v`.

To register a new account instead, you'll need the value of `user.registration.invite-code`.

## 🧪 Tests

```bash
./gradlew test
```

```bash
cd client && npm test
```

`npm test` starts Vitest in watch mode; use `npx vitest run` for a single pass in CI.

## 📡 API Overview

Endpoints are split by perspective rather than by entity, so each one returns only what its caller is allowed to see.

| Method | Endpoint                        | Description                              |
| ------ | ------------------------------- | ---------------------------------------- |
| POST   | `/api/auth/register`            | Register with an invite code             |
| POST   | `/api/auth/login`               | Obtain a JWT                             |
| GET    | `/api/season/active`            | Current active season                    |
| GET    | `/api/season/submissions`       | Submissions, masked until reveal         |
| GET    | `/api/season/submissions/me`    | The caller's own submission              |
| GET    | `/api/season/active/selection`  | Submissions already revealed this season |
| GET    | `/api/submission/search`        | TMDB movie search                        |
| POST   | `/api/submission/submit`        | Submit a movie                           |
| PUT    | `/api/submission/update`        | Change your submission                   |
| GET    | `/api/admin/submissions`        | All submissions, unmasked                |
| POST   | `/api/admin/season`             | Create a season                          |
| POST   | `/api/admin/season/{id}/lock`   | Close submissions                        |
| POST   | `/api/admin/season/{id}/unlock` | Reopen submissions                       |
| POST   | `/api/admin/reveal`             | Mark a submission (by id) as revealed    |

## 🚢 Deployment

The app deploys to Google Cloud Run backed by MongoDB Atlas. See [aux_setup/DEPLOYMENT.md](aux_setup/DEPLOYMENT.md) for the full walkthrough.

The `buildAndPushBE`, `buildAndPushFE`, `deployBE`, and `deployFE` Gradle tasks wrap the build and deploy commands. They shell out through `cmd /c` and therefore only run on Windows.

## ⚖️ Credits
This product uses the TMDB API but is not endorsed or certified by TMDB.
