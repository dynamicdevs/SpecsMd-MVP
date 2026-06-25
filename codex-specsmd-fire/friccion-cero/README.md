# Friccion Cero

Friccion Cero is a fullstack MVP for detecting, measuring, prioritizing, and tracking operational frictions. It helps teams record time loss, repeated manual work, waiting, duplicated data, human errors, and traceability gaps, then convert the most relevant problems into improvement initiatives.

## MVP Scope

- CRUD for frictions.
- Automatic monthly hours lost calculation.
- Automatic estimated monthly cost calculation.
- Rule-based category, automation potential, and priority suggestions.
- Dashboard with general metrics and most costly frictions.
- Initiatives created from frictions and tracked through basic statuses.
- Angular frontend connected to a Node.js API.

## Stack

| Layer    | Technology                             |
| -------- | -------------------------------------- |
| Frontend | Angular 21, PrimeNG                    |
| Backend  | Node.js, TypeScript, Express           |
| Database | SQLite                                 |
| ORM      | Prisma                                 |
| Tests    | Vitest, Supertest, Angular test runner |

## Prerequisites

- Node.js compatible with the installed Angular CLI and backend toolchain.
- npm.
- Two terminal sessions are recommended: one for the backend and one for the frontend.

## Backend Setup

Run from `friccion-cero/backend`:

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run db:setup
npm run dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`.

The backend runs at:

```text
http://localhost:3000
```

Useful backend endpoints:

- `GET /health`
- `GET /api/docs/`
- `GET /api/frictions`
- `GET /api/initiatives`
- `GET /api/dashboard`

## Frontend Setup

Run from `friccion-cero/frontend`:

```bash
npm install
npm start
```

The frontend runs at:

```text
http://localhost:4200
```

The frontend API base URL is configured in:

```text
frontend/src/environments/environment.ts
```

By default it points to:

```text
http://localhost:3000
```

## SQLite and Configuration

The backend uses SQLite through Prisma. Configuration lives in `backend/.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./friccion-cero.db"
DEFAULT_HOURLY_COST=25
```

Important behavior:

- `DATABASE_URL` controls where the SQLite file is created.
- `npm run db:setup` applies the Prisma schema to the configured SQLite database.
- Tests use `DATABASE_URL=file:./test.db` from `backend/vitest.config.ts`.
- `DEFAULT_HOURLY_COST` is used to estimate monthly cost from monthly hours lost.

## Test Commands

Backend:

```bash
cd friccion-cero/backend
npm run build
npm test
npm audit --omit=dev
```

Frontend:

```bash
cd friccion-cero/frontend
npm run build
npm test -- --watch=false
npm audit --omit=dev
```

More detail is available in `TESTING.md`.

## Important Technical Decisions

- The backend uses a modular folder structure (`entities`, `dtos`, `services`, `repositories`, `controllers`, `persistence`) instead of a multi-package architecture. This keeps the MVP easy to navigate without overengineering.
- Prisma is used for typed SQLite persistence while repositories keep controller code independent from direct database calls.
- Friction impact, classification, automation potential, and priority rules live in services so API endpoints and tests can reuse the same behavior.
- The frontend uses standalone Angular components and PrimeNG controls to keep screens practical and consistent.
- Dashboard metrics are aggregated by the backend and displayed by the frontend without duplicating calculation logic client-side.

## Known Limitations

- There is no authentication or authorization yet.
- Currency display is formatted as USD and hourly cost is a single global backend setting.
- Rule-based classification is intentionally simple and keyword-driven.
- SQLite is suitable for the MVP and local evaluation, but production usage would need a stronger deployment and backup strategy.
- There is no migration pipeline beyond Prisma schema push/setup commands.
- UI tests are focused smoke/component tests, not exhaustive end-to-end browser coverage.

## Next-Step Ideas

- Add users, roles, and area/team ownership.
- Add configurable hourly cost per area or team.
- Add filtering, search, and export for frictions and initiatives.
- Add richer initiative impact tracking and before/after savings.
- Add charts for cost distribution by area, category, and priority.
- Add e2e tests for the main user workflow.
- Prepare deployment documentation and environment-specific configuration.

## Development Flow

1. Start the backend with `npm run dev`.
2. Start the frontend with `npm start`.
3. Open `http://localhost:4200`.
4. Register frictions.
5. Review dashboard metrics and ranking.
6. Convert high-impact frictions into initiatives.
7. Run backend and frontend tests before shipping changes.
