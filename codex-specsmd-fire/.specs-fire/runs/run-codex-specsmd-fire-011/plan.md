# Implementation Plan for "Dashboard Screen"

## Work Item

- Intent: `friccion-cero`
- Work item: `dashboard-screen`
- Mode: `confirm`
- Run: `run-codex-specsmd-fire-011`

## Approach

Implement the Angular dashboard as a real operational summary connected to `DashboardApiService.getSummary()`. The page will load the dashboard API response, render top-level metric cards, show initiative status counts, and list the most costly frictions with links back to friction detail pages.

The implementation will stay simple and MVP-focused: one standalone page component, existing shared models/services, existing formatter helpers, and PrimeNG cards/tables/tags/messages. Empty, loading, and error states will be handled inside the dashboard page without adding new architecture.

## Implementation Checklist

- Load dashboard data on component initialization using the existing `DashboardApiService`.
- Replace hardcoded zero values with API-driven totals:
  - total frictions
  - monthly hours lost
  - estimated monthly cost
  - total initiatives
- Add initiative status summary using the existing initiative status labels and severities.
- Add a ranking table for `mostCostlyFrictions`, including title, area, category, monthly hours, estimated monthly cost, priority, status, and a detail action.
- Add graceful empty state when no frictions/ranking data exists.
- Add error and retry handling for API failures.
- Keep styling operational and compact, matching the existing app shell and feature pages.

## Files to Modify

- `friccion-cero/frontend/src/app/features/dashboard/dashboard-page.component.ts`
  - Expand component imports for Angular control flow, router links, PrimeNG table/message/button/progress spinner as needed.
  - Add signals/state for loading, error, and loaded summary.
  - Add helper methods for formatting totals and labels.
  - Replace placeholder template with metric cards, status summary, ranking table, and states.

## Files to Create

- `friccion-cero/frontend/src/app/features/dashboard/dashboard-screen.spec.ts`
  - Add a focused component test with a mocked dashboard API response.
  - Verify totals, initiative summary, and empty-state/ranking behavior enough to protect the screen contract.

## Tests and Verification

- Run frontend build:
  - `npm run build`
- Run frontend tests:
  - `npm test -- --watch=false`
- Run production dependency audit:
  - `npm audit --omit=dev`
- If the local dev server is available, verify `/dashboard` renders through the browser or HTTP route.

## Technical Decisions

- Use the existing dashboard API contract instead of additional frontend aggregation.
- Use existing formatter helpers (`formatHours`, `formatCurrency`, label/severity helpers) to keep display behavior consistent with friction and initiative screens.
- Keep all dashboard behavior in the page component for the MVP; extracting child components would add structure before there is enough reuse.

## Acceptance Mapping

- Dashboard displays total frictions: metric card from `summary.totals.frictions`.
- Dashboard displays monthly hours lost: metric card from `summary.totals.monthlyHoursLost`.
- Dashboard displays estimated monthly cost: metric card from `summary.totals.estimatedMonthlyCost`.
- Dashboard displays initiative status summary: status summary section from `initiativeCountsByStatus`.
- Dashboard displays ranking of most costly frictions: PrimeNG table from `mostCostlyFrictions`.
- Dashboard handles empty states gracefully: explicit empty state when totals/ranking are empty.
- UI is connected to Dashboard API: page uses `DashboardApiService.getSummary()` on load.

---

Approve plan? `[Y/n/edit]`
