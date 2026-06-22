---
stage: test
bolt: 001-cinema-catalog
created: 2026-06-19T20:52:09Z
---

## Test Report: 001-cinema-catalog

### Summary

- **Test Files**: 3/3 passed
- **Tests**: 36/36 passed
- **Statements**: 98.50%
- **Branches**: 96.66%
- **Functions**: 100%
- **Lines**: 98.43%
- **Build**: Passed
- **Static Validation**: Passed
- **Real Fixture Smoke Check**: Passed

### Test Files

- [x] `codex-specsmd/tests/catalog-validation.test.ts` - Catalog and state schema validation, normalization, uniqueness, references, formats, and dates.
- [x] `codex-specsmd/tests/catalog-queries.test.ts` - Movie, showtime, and seat-availability behavior through pure functions and the application service.
- [x] `codex-specsmd/tests/json-readers.test.ts` - Injected filesystem paths, reload behavior, missing files, and malformed JSON.
- [x] `codex-specsmd/tests/fixtures/catalog-fixtures.ts` - Resettable typed test inputs shared without mutable test order dependencies.

### Acceptance Criteria Validation

- ✅ **Movies preserve fixture order and stable fields**: Verified with classified and unclassified movies.
- ✅ **Empty catalog succeeds explicitly**: Verified as an empty collection rather than an error.
- ✅ **Unreadable, malformed, and duplicate catalog data fail atomically**: Verified with typed error codes and no partial results.
- ✅ **Showtimes expose required details in fixture order**: Verified IDs, formats, and auditorium names.
- ✅ **Unknown movie differs from movie with no showtimes**: Verified typed not-found error versus successful empty collection.
- ✅ **Seat availability preserves layout order**: Verified ordered available and sold projections.
- ✅ **Persisted sold seats survive separate reads**: Verified by rewriting and reloading the same injected state path.
- ✅ **Unknown showtimes and inconsistent state fail clearly**: Verified not-found and unknown-seat state errors.
- ✅ **Queries do not mutate fixture or state data**: Query results are projected copies and all tests remain order-independent.
- ✅ **Cross-platform boundary behavior**: Uses Node path and filesystem APIs with injected paths; tests pass on the current Windows environment without platform-specific path assumptions.
- ✅ **Build and coverage gates**: `npm run build`, `npm run lint`, `npm test`, and `npm run test:coverage` all pass.

### Real Fixture Verification

The compiled application loaded the bundled catalog and state successfully, returning three movies, two Dune showtimes, and persisted sold seats `A2` and `B3` for the IMAX showtime.

### Issues Found

1. An initial adapter-test matcher incorrectly constrained the movie array to one element; the assertion was corrected to validate both total size and the first ordered item.
2. The initial build emitted compiled test files into `dist`, causing Vitest to discover stale duplicates. Build and test TypeScript configurations were separated, generated output was cleaned safely, and Vitest now excludes `dist`.
3. No remaining implementation defects were found.

### Notes

The coverage threshold of 80% is exceeded substantially. Purchase mutation, pricing, discounting, confirmation, and Commander.js command behavior remain outside this bolt and are assigned to later bolts.
