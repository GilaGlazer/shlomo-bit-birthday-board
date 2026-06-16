# Birthday Board

A full-stack Birthday Board app — see who's celebrating today, and manage the full list.

**Stack:** React + TypeScript · Node.js + Express + TypeScript · PostgreSQL + Prisma · Docker

---

## Prerequisites

**Docker Desktop must be installed and running.** That's the only requirement — no Node.js, no PostgreSQL, no `npm install`. Everything (database, backend, frontend) runs inside containers.

- Install Docker Desktop: https://www.docker.com/products/docker-desktop
- Make sure Docker Desktop is **open and running** before the next step

---

## Run It

**Step 1 — Clone the repo:**
```bash
git clone <repo-url>
cd shlomo-bit-birthday-board
```

**Step 2 — Start everything with one command:**
```bash
docker compose up
```

This single command builds the frontend, backend, and database images, starts PostgreSQL, runs the schema migration, and seeds demo data — automatically, in that order. No extra setup, no `.env` file to create.

**Step 3 — Open the app:**

| Service  | URL                   |
|----------|-----------------------|
| App      | http://localhost:5173 |
| API      | http://localhost:3000/api/health |

Wait for the terminal to show:
```
birthday-frontend  |   Birthday Board is ready!
birthday-frontend  |   Open http://localhost:5173
```

The seed creates a demo user and 12 sample people (2 of them always share *today's* birthday).

---

## Demo Credentials

| Email | Password |
|-------|----------|
| demo@birthday.com | password123 |

---

## How It Works

Authentication uses **HTTP-only cookies** — the token is never exposed to JavaScript. After login the browser automatically attaches the cookie to every request.

---

## API Reference

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, sets HTTP-only cookie |
| POST | `/api/auth/logout` | ✅ | Logout, clears cookie |
| GET | `/api/auth/me` | ✅ | Get current user |

**Register / Login body:**
```json
{ "email": "user@example.com", "password": "password123" }
```

---

### People

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/people` | ✅ | Paginated list with optional search |
| GET | `/api/people/today` | ✅ | Today's birthdays |
| POST | `/api/people` | ✅ | Add a person |
| PATCH | `/api/people/:id` | ✅ | Edit a person |
| DELETE | `/api/people/:id` | ✅ | Delete a person |

**Query params for GET /api/people:** `?page=1&limit=10&search=alice`

**POST / PATCH body:**
```json
{ "name": "Alice", "birthDate": "1990-05-15" }
```

---

## Architecture

```
Request → Route → Controller → Service → Repository → Prisma → PostgreSQL
```

- **Routes** — define paths and attach middleware
- **Controllers** — thin layer: receive request, call service, send response
- **Services** — business logic and ownership checks
- **Repositories** — all DB queries isolated in one place
- **Middlewares** — `authMiddleware`, `validate` (Zod), `errorHandler`

---

## Stopping

```bash
docker compose down        # stop containers
docker compose down -v     # stop + wipe database volume (next "up" reseeds from scratch)
```
