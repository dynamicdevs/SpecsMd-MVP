---
stage: test
bolt: 001-ticketing-domain
created: 2026-06-19T00:00:00Z
---

## Test Report: ticketing-domain

### Summary

- **Tests**: 23/23 passed (4 files)
- **Typecheck**: `tsc --noEmit` passes (strict, no `any`)
- **Runner**: Vitest 2.1.9

### Test Files

- [x] `src/domain/pricing.test.ts` - 2D/3D/IMAX pricing, zero seats, IMAX > 3D surcharge, injected config, invalid seat counts (7 tests)
- [x] `src/domain/discount.test.ts` - Tuesday detection, 20% on Tuesday, no discount otherwise, half-up rounding (5 tests)
- [x] `src/domain/seats.test.ts` - valid selection, case/whitespace normalization, empty/duplicate/unknown/sold, all-or-nothing (7 tests)
- [x] `src/domain/confirmation.test.ts` - all fields present, deterministic id, seed sensitivity, name trimming + empty-name rejection (4 tests)

### Acceptance Criteria Validation

- ✅ **FR-5 / story 002**: Unknown, sold, duplicate, and empty selections rejected with typed errors naming offending seats; all-or-nothing verified
- ✅ **FR-6 / story 003**: 2D = N×$10, 3D = N×$13, IMAX = N×$16; IMAX surcharge > 3D
- ✅ **FR-7 / story 004**: 20% discount only on Tuesday (injected date); half-up rounding verified (2503¢ → 501¢)
- ✅ **FR-8 / story 005**: Confirmation includes all six fields; ID deterministic and seed-sensitive
- ✅ **Story 001**: Domain types compile under strict TS; money in integer cents
- ✅ **NFR-1/2**: No I/O or framework imports in `src/domain`; strict mode, no `any`

### Issues Found

None.

### Notes

`npm install` added 45 packages (typescript, vitest + transitive). Tests run in ~0.6s via `npm test`. Confirmation IDs use a deterministic FNV-1a hash, so the suite needs no clock or randomness controls.
