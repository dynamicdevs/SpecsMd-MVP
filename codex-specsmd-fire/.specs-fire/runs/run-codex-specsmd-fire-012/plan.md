# Implementation Plan for "Basic Tests"

## Work Item

- Intent: `friccion-cero`
- Work item: `basic-tests`
- Mode: `confirm`
- Run: `run-codex-specsmd-fire-012`

## Current Test Baseline

The project already has useful coverage from earlier work items:

- Backend rule tests in `backend/src/services/friction-rules.test.ts`
- Backend controller smoke tests for frictions, initiatives, dashboard, health, and docs
- Backend repository tests
- Frontend shell, friction form, initiative form, and dashboard component tests

This work item will strengthen the MVP test safety net without duplicating the existing suite.

## Approach

Add focused tests for the most important behavioral contracts that can regress easily:

- calculation edge cases and rule combinations in backend services
- core API endpoint smoke behavior already present, with one or two targeted gaps only if the existing controller tests do not cover them
- frontend HTTP service wiring with Angular's HTTP testing utilities
- concise test-command documentation for backend and frontend

## Implementation Checklist

- Extend backend rule tests:
  - monthly hours lost formula for another frequency/person combination
  - estimated monthly cost with a different hourly cost
  - automation potential for high-automation categories
  - priority behavior for medium/high thresholds
- Add frontend API service wiring tests:
  - `DashboardApiService.getSummary()` calls `/api/dashboard`
  - `FrictionApiService.create()` calls `/api/frictions`
  - `InitiativeApiService.createFromFriction()` calls `/api/frictions/:id/initiatives`
- Document test commands:
  - backend build/test/audit command
  - frontend build/test/production audit command
  - note that full dev audit may include Angular build-tool development advisories already known from previous runs
- Run complete verification for both apps.

## Files to Modify

- `friccion-cero/backend/src/services/friction-rules.test.ts`
  - Add compact tests for calculation/rule edge cases.

## Files to Create

- `friccion-cero/frontend/src/app/core/api/api-services.spec.ts`
  - Add HTTP wiring tests for the main frontend API services.
- `friccion-cero/TESTING.md`
  - Document local commands for backend and frontend verification.

## Tests and Verification

Backend:

- `npm run build`
- `npm test`
- `npm audit --omit=dev`

Frontend:

- `npm run build`
- `npm test -- --watch=false`
- `npm audit --omit=dev`

## Technical Decisions

- Reuse Vitest and Angular's existing test setup; no new test libraries.
- Prefer service/API smoke tests over exhaustive browser-like UI tests for this MVP.
- Keep test documentation separate in `TESTING.md` so the final execution documentation work item can link or incorporate it later.

## Acceptance Mapping

- Backend tests cover monthly hours lost calculation: existing plus additional rule test.
- Backend tests cover estimated monthly cost calculation: existing plus additional rule test.
- Backend tests cover priority and automation potential rules: existing plus additional rule tests.
- Backend API smoke tests cover core friction and initiative endpoints where practical: already present and re-run as part of this item.
- Frontend tests or smoke checks cover key screens and service wiring: existing screen tests plus new API service wiring tests.
- Test commands are documented: new `TESTING.md`.

---

Approve plan? `[Y/n/edit]`
