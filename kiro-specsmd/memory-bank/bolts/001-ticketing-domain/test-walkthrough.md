---
stage: test
bolt: 001-ticketing-domain
created: 2026-06-21T00:00:00Z
---

## Test Report: ticketing-domain

### Summary

- **Tests**: 25/25 passed
- **Test Files**: 4

### Test Files

- [x] `src/domain/validation.test.ts` - Seat validation: valid seats, invalid IDs, sold seats, empty selection, deduplication, all-or-nothing
- [x] `src/domain/pricing.test.ts` - Format pricing: 2D/3D/IMAX single and multiple seats, unknown format, zero/negative seats, constants
- [x] `src/domain/discount.test.ts` - Tuesday discount: applies on Tuesday, no discount other days, rounding, zero subtotal, invalid date
- [x] `src/domain/confirmation.test.ts` - Confirmation: all fields present, deterministic ID, order-independent seats, different inputs differ, sorted output

### Acceptance Criteria Validation

- ✅ **All types exported, no `any`**: Types are strict, compilation passes with `strict: true`
- ✅ **validateSeats rejects invalid/sold, accepts valid, all-or-nothing**: 6 tests covering all cases
- ✅ **calculatePrice correct for 2D/3D/IMAX × N seats**: 8 tests including edge cases
- ✅ **applyDiscount 20% only on Tuesday, returns integer**: 6 tests including rounding
- ✅ **generateConfirmation deterministic ID with all fields**: 5 tests including order-independence

### Issues Found

None

### Notes

All domain functions are pure and deterministic. No mocks needed — this is the ideal testing scenario.
