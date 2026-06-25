# Implementation Plan: Dashboard API

## Work Item

`dashboard-api` for intent `friccion-cero`.

## Approach

Add a small backend dashboard feature that calculates MVP metrics from persisted frictions and initiatives. Keep the implementation aligned with the current backend structure: repository/service/controller/route, documented in OpenAPI, covered by API tests.

The dashboard will expose a single endpoint:

- `GET /api/dashboard`

The response will include:

- total frictions
- total monthly hours lost
- total estimated monthly cost
- initiative counts by status
- friction counts by category
- friction counts by priority
- friction counts by status
- ranking of the most costly frictions

Aggregation will be done in a service from repository results. This is the simplest practical MVP choice and avoids premature query-level optimization while the dataset is small.

## Files to Create

- `friccion-cero/backend/src/services/dashboard.service.ts`
  - Aggregates dashboard totals, grouped counts, and top costly frictions.
- `friccion-cero/backend/src/controllers/dashboard.controller.ts`
  - HTTP handler for dashboard summary.
- `friccion-cero/backend/src/routes/dashboard.routes.ts`
  - Express route for `GET /api/dashboard`.
- `friccion-cero/backend/src/controllers/dashboard.controller.test.ts`
  - API tests for totals, rankings, grouped counts, and empty-state behavior.

## Files to Modify

- `friccion-cero/backend/src/routes/index.ts`
  - Mount dashboard routes.
- `friccion-cero/backend/src/openapi/openapi.ts`
  - Document `GET /api/dashboard`.
- `.specs-fire/intents/friccion-cero/work-items/dashboard-api.md`
  - Mark acceptance criteria complete after verification.

## Tests

Run from `friccion-cero/backend`:

- `DATABASE_URL=file:./test.db npm run build`
- `DATABASE_URL=file:./test.db npm test`
- `npm audit --omit=dev`

Expected test coverage additions:

- Dashboard returns zeroed metrics for an empty database.
- Dashboard calculates totals from persisted friction records.
- Dashboard counts initiatives by status.
- Dashboard groups frictions by category, priority, and status.
- Dashboard ranks most costly frictions in descending cost order.

## Decisions

- Use one endpoint for the MVP dashboard instead of multiple granular endpoints.
- Use service-level in-memory aggregation for clarity and speed of implementation.
- Limit costly friction ranking to the top 5 records by estimated monthly cost.
