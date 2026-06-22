---
stage: test
bolt: 002-ticketing-cli
created: 2026-06-19T18:45:00Z
---

## Test Report: ticketing-cli (data + read commands)

### Summary

- **Tests**: 36/36 passed across the whole project (13 new in this bolt)
- **Typecheck**: `tsc --noEmit` passes (strict)
- **Runner**: Vitest 2.1.9

### Test Files (new in this bolt)

- [x] `src/data/loader.test.ts` - loads bundled catalog (3 movies, 4 showtimes), parses seat availability, throws `DataError` for a missing dir (3 tests)
- [x] `src/commands/format.test.ts` - `formatMoney` whole/fractional/padding/negative (3 tests)
- [x] `src/commands/billboard.test.ts` - lists movies; empty billboard message (2 tests)
- [x] `src/commands/showtimes.test.ts` - lists showtimes + seat counts; no-showtimes message; `UnknownMovieError` (3 tests)
- [x] `src/commands/seats.test.ts` - O/X seat map + available-only list; `UnknownShowtimeError` (2 tests)

### Acceptance Criteria Validation

- ✅ **FR-10 / story 001**: `loadDataset` returns typed dataset from JSON; malformed/missing dir → `DataError`
- ✅ **FR-1 / story 002**: billboard lists every movie with id, title, formats
- ✅ **FR-2 / story 003**: showtimes listed per movie; unknown movie → `UnknownMovieError`
- ✅ **FR-3 / story 004**: seats shown with available/sold distinction; unknown showtime → `UnknownShowtimeError`
- ✅ Deterministic rendering; no domain rules duplicated in the command layer

### Issues Found

None.

### Notes

`@types/node` added (dev) for the loader's `node:*` imports. Read commands return strings and are tested without stdout capture; the Commander entry point + npm scripts that invoke them are story 006 in bolt 003.
