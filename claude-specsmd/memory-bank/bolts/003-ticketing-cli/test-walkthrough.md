---
stage: test
bolt: 003-ticketing-cli
created: 2026-06-19T18:52:00Z
---

## Test Report: ticketing-cli (purchase flow + CLI entry)

### Summary

- **Tests**: 46/46 passed across the whole project (10 new in this bolt)
- **Typecheck**: `tsc --noEmit` passes (strict)
- **Runner**: Vitest 2.1.9

### Test Files (new in this bolt)

- [x] `src/commands/buy.test.ts` - Tuesday IMAX purchase (20% discount → $25.60), non-Tuesday 3D (no discount), sold seat, unknown seat, unknown movie, unknown showtime, empty name (7 tests)
- [x] `src/program.test.ts` - `billboard` prints listing; `buy` prints confirmation with correct total; unknown movie → `console.error` + `process.exitCode = 1` (3 tests)

### Acceptance Criteria Validation

- ✅ **FR-4 / story 005**: valid purchase returns a confirmation with movie, showtime, seats, name, total, id
- ✅ **FR-7 / story 005**: Tuesday total reflects 20% off (subtotal $32.00 → total $25.60); non-Tuesday unaffected
- ✅ **FR-5 / story 005**: unknown/sold seats and empty name rejected with typed errors (all-or-nothing)
- ✅ **FR-9 / story 006**: `billboard`, `showtimes`, `seats`, `buy` wired with `--help`; npm scripts run each; `npm test` runs Vitest
- ✅ Errors print a clear message and set a non-zero exit code; success exits 0

### Issues Found

One initial failure: a success-path test asserted `process.exitCode === 0`, but Node leaves it `undefined` until set. Fixed by resetting `process.exitCode = 0` in `beforeEach`. Re-run: all green.

### Notes

`commander` (runtime) and `tsx` (dev) added. The program is tested via `buildProgram().parseAsync(...)` with console spies — no child processes — and a manual smoke test also confirmed the real CLI (`npm run buy …`) works end-to-end.
