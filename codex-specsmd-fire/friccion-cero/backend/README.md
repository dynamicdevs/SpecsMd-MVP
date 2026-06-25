# Friccion Cero Backend

Node.js, TypeScript, Express, Prisma, and SQLite backend for the Friccion Cero MVP.

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run db:setup
npm run dev
```

The API runs on `http://localhost:3000` by default.

## Commands

```bash
npm run dev
npm run build
npm test
npm run prisma:generate
npm run prisma:push
npm run db:setup
```

## Initial Endpoints

- `GET /health`
- `GET /api/docs`

## Architecture Decision

The MVP uses one backend package with folder boundaries for controllers, DTOs, entities, repositories, services, and persistence. This keeps responsibilities clear while avoiding premature multi-package architecture.

Prisma is included now to establish typed SQLite access, but business models are intentionally deferred to the `domain-model-and-persistence` work item.

## Persistence

SQLite is configured through `DATABASE_URL`.

```bash
npm run prisma:generate
npm run db:setup
```

The initial persistence model includes:

- `Friction`
- `Initiative`
- `FrictionComment`

Repositories live in `src/repositories` and use Prisma behind small interfaces so the API layer can stay focused on request/response behavior.
