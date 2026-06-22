---
stage: test
bolt: 002-ticket-purchase
created: 2026-06-19T21:27:52Z
---

## Test Report: 002-ticket-purchase

### Summary

- **Test Files**: 7/7 passed
- **Tests**: 74/74 passed
- **New Purchase Tests**: 38 passed
- **Statements**: 99.05%
- **Branches**: 97.36%
- **Functions**: 100%
- **Lines**: 99.00%
- **Pricing Branches**: 100%
- **Discount Branches**: 100%
- **Build**: Passed
- **Static Validation**: Passed

### Test Files

- [x] `codex-specsmd/tests/purchase-request.test.ts` - Required fields, trimming, uppercase normalization, empty selections, and duplicate seats.
- [x] `codex-specsmd/tests/seat-selection.test.ts` - Valid selection, nonexistent seats, sold seats, mixed failures, unknown showtimes, inconsistent catalogs, and immutability.
- [x] `codex-specsmd/tests/pricing-discount.test.ts` - Every format, seat counts, integer safety, Tuesday eligibility, non-Tuesday behavior, UTC determinism, half-up rounding, and overflow.
- [x] `codex-specsmd/tests/prepare-purchase.test.ts` - Pre-read validation, complete preparation, unchanged state, mixed seat failure, and injected-reference consistency.
- [x] Existing catalog validation, query, and reader tests remain passing.

### Acceptance Criteria Validation

- ✅ **Valid request normalization**: Customer and showtime are trimmed; seats are trimmed and uppercased.
- ✅ **Invalid request fails before reads**: Blank fields, non-array/empty selections, empty labels, and duplicates produce typed request errors; reader fakes are never called.
- ✅ **Complete seat validation**: Every seat must exist and be unsold for the selected auditorium and showtime.
- ✅ **Atomic mixed failure**: One error reports all nonexistent and sold seats; no state field changes.
- ✅ **State invariants preserved**: Purchases, sold seats, and sequence remain deeply equal after failed and successful preparation because this bolt performs no transition.
- ✅ **Exact format prices**: 2D = 800, 3D = 1100, and IMAX = 1500 minor units per seat.
- ✅ **Exact subtotal**: Unit price is multiplied by a positive safe integer seat count.
- ✅ **Invalid pricing rejected**: Unsupported formats, invalid counts, and safe-integer overflow produce typed errors.
- ✅ **Tuesday discount**: A fixture Tuesday receives 20% using half-up rounding; a subtotal of 803 yields a discount of 161.
- ✅ **Non-Tuesday discount**: Discount is zero and total equals subtotal.
- ✅ **UTC determinism**: Weekday uses the UTC fixture timestamp and is independent of host date, locale, and timezone.
- ✅ **Domain separation**: Domain code contains no Commander.js, filesystem, path, process, or console usage.
- ✅ **Quality gates**: Build, static validation, tests, global coverage, and 100% pricing/discount branch coverage pass.

### Issues Found

1. A redundant negative-total guard in the preparation service was unreachable because the validated discount can never exceed subtotal. It was removed during Stage 3 to keep the invariant expressed in one place and avoid dead defensive code.
2. No remaining implementation defects were found.

### Notes

This bolt deliberately stops at a prepared purchase and unchanged state snapshot. Atomic JSON writing, confirmation sequencing, and persisted purchase records remain assigned to `003-ticket-purchase`.
