# Walkthrough: Dashboard API

## Endpoint

- `GET /api/dashboard`

## Response Shape

The endpoint returns a single dashboard summary object with:

- `totals.frictions`
- `totals.monthlyHoursLost`
- `totals.estimatedMonthlyCost`
- `totals.initiatives`
- `initiativeCountsByStatus`
- `frictionCountsByCategory`
- `frictionCountsByPriority`
- `frictionCountsByStatus`
- `mostCostlyFrictions`

## Behavior

The dashboard service reads persisted frictions and initiatives through the existing repositories, then performs simple in-memory aggregation. This keeps the MVP easy to understand and avoids adding query-specific repository complexity before the dataset requires it.

`mostCostlyFrictions` returns the top 5 frictions sorted by `estimatedMonthlyCost` in descending order.

## Verification

The backend build and the full Vitest suite pass with 25 tests.
