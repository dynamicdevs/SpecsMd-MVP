---
stage: test
bolt: 003-ticketing-cli
created: 2026-06-21T14:14:00Z
---

## Test Report: ticketing-cli (buy + entry point)

### Summary

- **Tests**: 9/9 passed (bolt-specific)
- **Total suite**: 47/47 passed (all bolts)

### Test Files

- [x] `src/commands/buy.test.ts` - Valid purchase, Tuesday discount, no discount on other days, sold seat rejection, non-existent seat, invalid showtime, missing args, persistence to JSON, deterministic ID

### Acceptance Criteria Validation

- ✅ **buy succeeds for valid seats, prints confirmation, exit code 0**: Tested with 2 seats
- ✅ **buy rejects invalid/sold seats with clear error, exit code 1**: Tested both cases
- ✅ **buy rejects missing arguments**: Tested empty options
- ✅ **Tuesday discount reflected**: Verified discount line appears on Tuesday, absent on Monday
- ✅ **Purchase persisted to purchases.json**: Read file after buy, verified content
- ✅ **Subsequent seats shows purchased as sold**: Verified end-to-end via CLI run
- ✅ **Deterministic confirmation ID**: Same inputs produce same ID
- ✅ **npm scripts work**: Build + all commands verified manually

### End-to-End Verification (Manual)

```
$ node dist/index.js billboard → ✅ Lists 3 movies
$ node dist/index.js showtimes --movie movie-002 → ✅ Shows 2 showtimes
$ node dist/index.js seats --showtime st-001 → ✅ Shows 20 free seats
$ node dist/index.js buy --showtime st-002 --seats A1,A2 --customer "Juan" → ✅ Confirmation with discount
$ node dist/index.js seats --showtime st-002 → ✅ A1,A2 now sold
```

### Issues Found

None

### Notes

Tests use isolated temp directories for persistence, preventing cross-test contamination.
