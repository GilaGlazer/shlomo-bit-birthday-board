# 🎂 Birthday Board

A full-stack web app for tracking birthdays — see who's celebrating today, search and paginate through everyone else, and manage the list (add / edit / delete).

**Repository:** [github.com/GilaGlazer/shlomo-bit-birthday-board](https://github.com/GilaGlazer/shlomo-bit-birthday-board)

---

## 🎯 Project Overview

This is a home assignment project demonstrating a clean, layered full-stack architecture:

- **Authentication** with HTTP-only cookies (JWT under the hood, never exposed to JavaScript)
- **Validation** on every request (body / query / params) with Zod
- **Authorization** — every person record is scoped to the user who created it
- **Error handling** centralized in one place, with safe messages in production
- **Docker-first** — the entire stack (database, backend, frontend) runs with a single command, no local installs required

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express + TypeScript
- **ORM**: Prisma 5
- **Database**: PostgreSQL 16
- **Validation**: Zod
- **Authentication**: JWT, delivered via HTTP-only cookie
- **Security**: bcrypt password hashing, ownership checks, parameterized queries (Prisma)

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Data fetching**: TanStack React Query
- **State**: Zustand (persisted auth state)
- **Styling**: Tailwind CSS

### DevOps
- **Containerization**: Docker (multi-stage builds)
- **Orchestration**: Docker Compose
- **Dev experience**: a separate `docker-compose.dev.yml` with hot-reload (Vite HMR + ts-node-dev) for active development

---

## 🐳 Why Docker?

This project is fully containerized so that **anyone can run it with one command, regardless of their machine**: no Node.js version conflicts, no local PostgreSQL install, no manually creating databases or running migrations by hand. `docker compose up` builds the frontend and backend images, starts PostgreSQL, waits for it to be healthy, pushes the Prisma schema, seeds demo data, and starts the servers — in the correct order, every time. It also matches how this app would actually be deployed, so the local setup is a realistic preview of production.

---

## 🚀 Quick Start

### Prerequisites

You only need **Docker Desktop** — nothing else (no Node.js, no PostgreSQL, no `npm install`).

**Don't have Docker installed?**
1. Download Docker Desktop: **https://www.docker.com/products/docker-desktop**
2. Install it and **open the Docker Desktop app**
3. Wait until it says "Docker Desktop is running" (whale icon in the system tray is steady, not animating)
4. Continue with the steps below

### Setup & Run

**1. Clone the repository:**
```bash
git clone https://github.com/GilaGlazer/shlomo-bit-birthday-board.git
cd shlomo-bit-birthday-board
```

**2. Start everything with one command:**
```bash
docker compose up
```

No `.env` file to create, no flags needed. On first run this will:
1. Build the backend and frontend Docker images
2. Start PostgreSQL and wait until it's healthy
3. Push the Prisma schema to the database
4. Seed a demo user + 12 sample people (2 of them always share *today's* birthday)
5. Start the backend and frontend servers

This takes 1–3 minutes on first run (subsequent runs are seconds, since images are cached).

**3. Wait for the backend to finish setting up.**

The frontend's Nginx server starts almost instantly, so you'll see this early:
```
birthday-frontend  |   Birthday Board is ready!
birthday-frontend  |   Open http://localhost:5173
```
That line only means the frontend is serving files — it does **not** mean the app is usable yet. The backend still needs to push the database schema and seed demo data first. Wait for this line before opening the app, or login/data requests will fail:
```
birthday-backend   | 🚀 Server running on port 3000 [production]
birthday-backend   | 📡 Health: http://localhost:3000/api/health
```

**4. Open the app:**

| Service  | URL                                |
|----------|-------------------------------------|
| App      | http://localhost:5173               |
| API health | http://localhost:3000/api/health  |

### Default Test User

| Email | Password |
|-------|----------|
| `demo@birthday.com` | `password123` |

(You can also register a brand new account from the login screen.)

### Stopping

```bash
docker compose down        # stop containers, keep data
docker compose down -v     # stop + wipe the database (next "up" reseeds from scratch)
```

---

## 📂 Repository Structure

```
shlomo-bit-birthday-board/
├── backend/
│   ├── src/
│   │   ├── app.ts                  # Express app setup (CORS, cookies, routes)
│   │   ├── server.ts               # Entry point
│   │   ├── config/                 # Env vars, Prisma client instance
│   │   ├── routes/                 # authRoutes, personRoutes
│   │   ├── controllers/            # Thin layer: request in, response out
│   │   ├── services/               # Business logic, ownership checks
│   │   ├── repositories/           # All Prisma/DB queries, isolated
│   │   ├── middlewares/            # authMiddleware, validate (Zod), errorHandler
│   │   ├── schemas/                # Zod validation schemas
│   │   └── utils/                  # AppError, jwt helpers, response helpers
│   ├── prisma/
│   │   ├── schema.prisma           # users + people tables
│   │   └── seed.ts                 # Demo user + sample people
│   ├── scripts/docker-entrypoint.sh
│   ├── Dockerfile                  # Production build
│   └── Dockerfile.dev               # Hot-reload dev build
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Router + protected routes
│   │   ├── main.tsx                # Entry point
│   │   ├── pages/                  # LoginPage, BoardPage
│   │   ├── components/             # TodayBanner, PersonModal, Pagination
│   │   ├── api/                    # axios instance, authApi, peopleApi
│   │   ├── store/                  # Zustand auth store
│   │   └── utils/                  # Date / age / timezone helpers
│   ├── nginx.conf                  # Prod: serves the SPA + proxies /api
│   ├── Dockerfile                  # Production build (Vite build → Nginx)
│   └── Dockerfile.dev               # Hot-reload dev build (Vite dev server)
│
├── docker-compose.yml              # Production stack
├── docker-compose.dev.yml          # Dev stack with hot reload
└── README.md
```

### Architecture (Backend)

```
Request → Route → Controller → Service → Repository → Prisma → PostgreSQL
```

- **Routes** — define paths and attach middleware
- **Controllers** — thin layer: receive request, call service, send response
- **Services** — business logic and ownership checks
- **Repositories** — all DB queries isolated in one place
- **Middlewares** — `authMiddleware` (verifies cookie + checks user still exists), `validate` (Zod), `errorHandler`

---

## 🔒 Security Features

- **Password hashing** — bcrypt, password never returned by the API
- **HTTP-only cookies** — the JWT is never exposed to JavaScript, mitigating token theft via XSS
- **SameSite=Strict** cookie — mitigates CSRF
- **Ownership checks** — a user can only read/edit/delete people they created
- **Input validation** — Zod schemas on every body, query, and route param
- **SQL injection protection** — Prisma's parameterized queries, no raw string concatenation
- **UUID primary keys** — not sequential integers
- **Safe error responses** — internal errors are never leaked to the client in production

---

## 🧪 API Reference

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

### People

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/people` | ✅ | Paginated list, optional `search` |
| GET | `/api/people/today` | ✅ | Today's birthdays |
| POST | `/api/people` | ✅ | Add a person |
| PATCH | `/api/people/:id` | ✅ | Edit a person |
| DELETE | `/api/people/:id` | ✅ | Delete a person |

**Query params for `GET /api/people`:** `?page=1&limit=10&search=alice`

**POST / PATCH body:**
```json
{ "name": "Alice", "birthDate": "1990-05-15" }
```

---

## 🧑‍💻 Development (hot reload)

For active development with live reload instead of rebuilding images on every change:

```bash
docker compose -f docker-compose.dev.yml watch
```

This mounts `backend/src` and `frontend/src` as bind volumes, runs `ts-node-dev` and Vite's dev server, and rebuilds automatically when `package.json` changes.

---

## 🐛 Troubleshooting

**Containers won't start / weird errors:**
```bash
docker compose down -v
docker compose up --build
```

**Port already in use (3000 / 5173 / 5432):**
Stop whatever else is using that port, or edit the `ports:` mapping in `docker-compose.yml`.

**Changes not showing up:**
If you edited code while running the production `docker-compose.yml`, you need to rebuild: `docker compose up --build`. For live editing, use the dev compose file above instead.
