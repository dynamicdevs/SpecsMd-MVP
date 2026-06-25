---
run: run-codex-specsmd-fire-002
work_item: backend-solution-foundation
intent: friccion-cero
mode: confirm
checkpoint: plan
approved_at: null
---

# Implementation Plan: Backend Node API Foundation

## Approach

Create the backend foundation for Friccion Cero under `friccion-cero/backend/` using Node.js, TypeScript, Express, SQLite, Prisma, Zod, and OpenAPI tooling.

The first backend work item will only establish the runnable foundation and project structure. Domain entities, persistence schema, CRUD endpoints, calculation rules, and dashboard queries remain in later work items.

Planned backend shape:

```text
friccion-cero/
  backend/
    package.json
    tsconfig.json
    .env.example
    README.md
    prisma/
      schema.prisma
    src/
      app.ts
      server.ts
      config/
        env.ts
      controllers/
        health.controller.ts
      dtos/
        .gitkeep
      entities/
        .gitkeep
      repositories/
        .gitkeep
      services/
        .gitkeep
      persistence/
        prisma.ts
      routes/
        index.ts
      openapi/
        openapi.ts
```

Execution steps after approval:

1. Create `friccion-cero/backend`.
2. Initialize backend `package.json`.
3. Install runtime dependencies:
   - `express`
   - `cors`
   - `helmet`
   - `dotenv`
   - `zod`
   - `@prisma/client`
   - `swagger-ui-express`
4. Install dev dependencies:
   - `typescript`
   - `tsx`
   - `prisma`
   - `vitest`
   - `supertest`
   - relevant `@types/*` packages.
5. Add TypeScript config and npm scripts:
   - `dev`
   - `build`
   - `start`
   - `test`
   - `prisma:generate`
6. Add a minimal Express app with:
   - `/health`
   - `/api/docs`
   - JSON middleware
   - CORS
   - security headers
7. Add Prisma SQLite baseline configuration without defining business models yet.
8. Add `.env.example` with `DATABASE_URL` and `DEFAULT_HOURLY_COST`.
9. Add backend README with commands and architecture decision note.
10. Verify with `npm run build` and `npm test`.

## Files to Create

| File | Purpose |
|------|---------|
| `friccion-cero/backend/package.json` | Backend dependency manifest and scripts. |
| `friccion-cero/backend/tsconfig.json` | TypeScript compiler configuration. |
| `friccion-cero/backend/.env.example` | Example local configuration for SQLite and hourly cost. |
| `friccion-cero/backend/README.md` | Backend setup, run commands, and architecture decision note. |
| `friccion-cero/backend/prisma/schema.prisma` | Prisma SQLite baseline configuration. |
| `friccion-cero/backend/src/app.ts` | Express app factory and middleware wiring. |
| `friccion-cero/backend/src/server.ts` | Local HTTP server entrypoint. |
| `friccion-cero/backend/src/config/env.ts` | Typed environment/config loading. |
| `friccion-cero/backend/src/controllers/health.controller.ts` | Health endpoint handler. |
| `friccion-cero/backend/src/routes/index.ts` | API route registration. |
| `friccion-cero/backend/src/openapi/openapi.ts` | Minimal OpenAPI document and Swagger UI wiring. |
| `friccion-cero/backend/src/persistence/prisma.ts` | Prisma client singleton placeholder. |
| `friccion-cero/backend/src/dtos/.gitkeep` | Placeholder for DTOs in later work items. |
| `friccion-cero/backend/src/entities/.gitkeep` | Placeholder for entities in later work items. |
| `friccion-cero/backend/src/repositories/.gitkeep` | Placeholder for repositories in later work items. |
| `friccion-cero/backend/src/services/.gitkeep` | Placeholder for services in later work items. |
| `friccion-cero/backend/src/app.test.ts` | Smoke tests for health and docs endpoints. |

## Files to Modify

| File | Changes |
|------|---------|
| `.specs-fire/intents/friccion-cero/work-items/backend-solution-foundation.md` | Mark acceptance criteria completed after successful implementation. |

## Tests

| Test File | Coverage |
|-----------|----------|
| `friccion-cero/backend/src/app.test.ts` | Verifies `/health` and OpenAPI docs route are wired. |
| `(command) npm run build` | Verifies TypeScript compiles. |
| `(command) npm test` | Verifies backend smoke tests pass. |

## Technical Details

- Keep architecture simple: one backend package, folder boundaries by responsibility.
- Use Prisma because it gives typed SQLite access and clean migrations for later data-model work.
- Keep business models out of this work item; `domain-model-and-persistence` will add Friction, Initiative, and FrictionComment.
- Keep API endpoints minimal in this work item; feature endpoints arrive in `friction-api`, `initiative-api`, and `dashboard-api`.
- Use Zod now for config validation and later DTO validation.

---
*Plan awaiting checkpoint approval.*
