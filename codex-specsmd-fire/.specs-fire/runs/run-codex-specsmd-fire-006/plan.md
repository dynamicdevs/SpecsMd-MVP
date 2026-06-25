---
run: run-codex-specsmd-fire-006
work_item: initiative-api
intent: friccion-cero
mode: confirm
checkpoint: plan
approved_at: null
---

# Implementation Plan: Initiative API

## Approach

Implement initiative endpoints using the same controller/service/repository pattern established by Friction API. The service will validate input, ensure the source friction exists, default initiative priority from the friction when priority is omitted, and return initiative records with related friction context.

Endpoint scope:

```text
GET    /api/initiatives
POST   /api/frictions/:frictionId/initiatives
GET    /api/initiatives/:id
PUT    /api/initiatives/:id
DELETE /api/initiatives/:id
```

Behavior:

- Create initiative from friction: validate body, confirm friction exists, default priority from friction unless supplied.
- List initiatives: include related friction context.
- Detail: include related friction context.
- Update: allow core tracking fields and status updates.
- Delete: aligned with existing Friction API convention, return `204`.
- Validation errors: return `400` with Zod issues.
- Missing friction/initiative: return `404`.

## Files to Create

| File | Purpose |
|------|---------|
| `friccion-cero/backend/src/services/initiative.service.ts` | Application service for initiative create/list/detail/update/delete. |
| `friccion-cero/backend/src/controllers/initiative.controller.ts` | Express handlers for initiative endpoints. |
| `friccion-cero/backend/src/routes/initiative.routes.ts` | Initiative route definitions. |
| `friccion-cero/backend/src/controllers/initiative.controller.test.ts` | Supertest API coverage for initiative flows. |

## Files to Modify

| File | Changes |
|------|---------|
| `friccion-cero/backend/src/routes/index.ts` | Mount initiative routes under `/api/initiatives` and nested create under `/api/frictions/:frictionId/initiatives`. |
| `friccion-cero/backend/src/openapi/openapi.ts` | Add high-level Initiative API paths. |
| `friccion-cero/backend/src/dtos/initiative.dto.ts` | Add nested create schema if needed so frictionId comes from route params. |
| `.specs-fire/intents/friccion-cero/work-items/initiative-api.md` | Mark acceptance criteria complete after implementation. |

## Tests

| Test File | Coverage |
|-----------|----------|
| `friccion-cero/backend/src/controllers/initiative.controller.test.ts` | API tests for create/list/detail/update/delete/validation/default priority. |
| Existing backend tests | Ensure friction, repository, and rule behavior still passes. |
| `(command) npm run build` | Verifies TypeScript compiles. |
| `(command) npm test` | Verifies full backend suite passes. |

## Technical Details

- Use `createInitiativeSchema.omit({ frictionId: true })` for nested create.
- Fetch friction first and return `404` if it does not exist.
- Default `priority` from the friction record if request body omits it.
- Keep response shape as Prisma records with included `friction` for MVP frontend needs.
- Use status codes:
  - `200` for list/detail/update.
  - `201` for create.
  - `204` for delete.
  - `400` for validation errors.
  - `404` for missing records.

---
*Plan awaiting checkpoint approval.*
