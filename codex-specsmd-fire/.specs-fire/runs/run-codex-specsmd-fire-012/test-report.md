# Test Report: Basic Tests

## Run

- Run: `run-codex-specsmd-fire-012`
- Work item: `basic-tests`
- Intent: `friccion-cero`
- Date: 2026-06-25

## Commands

| Area | Command | Result |
| --- | --- | --- |
| Backend | `npm run build` | Passed |
| Backend | `npm test` | Passed |
| Backend | `npm audit --omit=dev` | Passed |
| Frontend | `npm run build` | Passed |
| Frontend | `npm test -- --watch=false` | Passed |
| Frontend | `npm audit --omit=dev` | Passed |

## Test Results

### Backend

- Test files: 6 passed
- Tests: 29 passed
- Failed: 0
- Skipped: 0
- Coverage: Not configured

### Frontend

- Test files: 5 passed
- Tests: 9 passed
- Failed: 0
- Skipped: 0
- Coverage: Not configured

## Tests Added or Expanded

- `friccion-cero/backend/src/services/friction-rules.test.ts`
  - Added occasional-frequency monthly hours calculation.
  - Added estimated-cost rounding behavior.
  - Added high automation potential checks for repeatable automation categories.
  - Added medium-priority rule coverage.
- `friccion-cero/frontend/src/app/core/api/api-services.spec.ts`
  - Added HTTP wiring tests for dashboard summary, friction creation, and initiative creation from a friction.

## Acceptance Criteria Validation

- Backend tests cover monthly hours lost calculation: Passed
- Backend tests cover estimated monthly cost calculation: Passed
- Backend tests cover priority and automation potential rules: Passed
- Backend API smoke tests cover core friction and initiative endpoints where practical: Passed
- Frontend tests or smoke checks cover key screens and service wiring: Passed
- Test commands are documented: Passed

## Notes

- The first backend test run exposed an incorrect medium-priority test fixture. The fixture was corrected to match the implemented scoring rule, then the full backend suite passed.
- Production dependency audits reported `found 0 vulnerabilities` for both backend and frontend.
