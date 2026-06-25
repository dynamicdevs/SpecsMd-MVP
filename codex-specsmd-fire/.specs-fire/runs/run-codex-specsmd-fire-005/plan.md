---
run: run-codex-specsmd-fire-005
work_item: friction-api
intent: friccion-cero
mode: confirm
checkpoint: plan
approved_at: null
---

# Implementation Plan: Friction API

## Approach

Implement REST-like friction endpoints under `/api/frictions`, using the existing DTO schemas, enrichment services, and Prisma repositories. Controllers will stay thin; an application service will coordinate validation, derived fields, repository calls, and useful 404/validation responses.

Endpoint scope:

```text
GET    /api/frictions
POST   /api/frictions
GET    /api/frictions/:id
PUT    /api/frictions/:id
DELETE /api/frictions/:id
POST   /api/frictions/:id/comments
GET    /api/frictions/:id/comments
```

Behavior:

- Create friction: validate input, enrich derived fields, persist.
- List frictions: return all persisted frictions with calculated fields.
- Detail: include comments and initiatives from repository detail query.
- Update: merge existing record with incoming changes, recalculate derived fields, persist.
- Delete: delete by ID and return `204`.
- Comments: create/list comments for a friction.
- Validation errors: return `400` with field-level Zod issues.
- Missing records: return `404`.

## Files to Create

| File | Purpose |
|------|---------|
| `friccion-cero/backend/src/services/friction.service.ts` | Application service coordinating friction CRUD, enrichment, and comments. |
| `friccion-cero/backend/src/controllers/friction.controller.ts` | Express handlers for friction endpoints. |
| `friccion-cero/backend/src/routes/friction.routes.ts` | Friction route definitions. |
| `friccion-cero/backend/src/controllers/http-error.ts` | Small HTTP error helper for 404/400 flow. |
| `friccion-cero/backend/src/controllers/validation.ts` | Zod validation response helper. |
| `friccion-cero/backend/src/controllers/friction.controller.test.ts` | Supertest API coverage for CRUD, derived fields, comments, and validation. |

## Files to Modify

| File | Changes |
|------|---------|
| `friccion-cero/backend/src/routes/index.ts` | Mount friction routes under `/api/frictions`. |
| `friccion-cero/backend/src/openapi/openapi.ts` | Add Friction API paths at a high level. |
| `friccion-cero/backend/src/dtos/friction.dto.ts` | Add API input schema if needed so derived fields remain server-controlled. |
| `.specs-fire/intents/friccion-cero/work-items/friction-api.md` | Mark acceptance criteria complete after implementation. |

## Tests

| Test File | Coverage |
|-----------|----------|
| `friccion-cero/backend/src/controllers/friction.controller.test.ts` | API tests for create/list/detail/update/delete/comments/validation. |
| Existing backend tests | Ensure app, repository, and rule tests still pass. |
| `(command) npm run build` | Verifies TypeScript compiles. |
| `(command) npm test` | Verifies full backend suite passes. |

## Technical Details

- Use `enrichFrictionInput` on create and update so API consumers do not manually send calculated fields.
- For update, fetch existing friction first, merge mutable input fields, then recalculate category/automation/impact/priority.
- Keep repository return types as-is for now unless TypeScript friction appears; this work item should not over-refactor repository typing.
- Return JSON shape directly from Prisma records for MVP. Dedicated API mappers can be introduced later if frontend needs different naming.
- Use status codes:
  - `200` for list/detail/update/comment list.
  - `201` for create friction/comment.
  - `204` for delete.
  - `400` for validation errors.
  - `404` for missing friction.

---
*Plan awaiting checkpoint approval.*
