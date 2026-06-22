---
stage: test
bolt: 002-ticketing-cli
created: 2026-06-21T14:08:00Z
---

## Test Report: ticketing-cli (read commands)

### Summary

- **Tests**: 13/13 passed (bolt-specific)
- **Total suite**: 38/38 passed (all bolts)

### Test Files

- [x] `src/data/loader.test.ts` - Data loading, purchase merging, missing files, invalid JSON
- [x] `src/commands/billboard.test.ts` - Lists movies, empty state message
- [x] `src/commands/showtimes.test.ts` - Filters by movie, invalid ID, missing option
- [x] `src/commands/seats.test.ts` - Shows availability, invalid showtime, missing option

### Acceptance Criteria Validation

- ✅ **JSON fixtures valid and well-typed**: Loaded successfully, typed DataStore
- ✅ **Loader loads correctly, throws on missing files**: Tested with missing + invalid files
- ✅ **billboard shows all movies**: Verified with 2 movies + empty state
- ✅ **showtimes filters by movie, errors on invalid**: 3 cases tested
- ✅ **seats shows status, errors on invalid showtime**: 3 cases tested
- ✅ **Data dir configurable for test isolation**: loader.test.ts uses temp dir per test

### Issues Found

None

### Notes

Tests use vi.spyOn on console.log/console.error for output verification. Loader tests use real temp directories for true integration testing.
