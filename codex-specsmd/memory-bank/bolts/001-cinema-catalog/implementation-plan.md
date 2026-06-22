---
stage: plan
bolt: 001-cinema-catalog
created: 2026-06-19T20:42:09Z
---

## Implementation Plan: 001-cinema-catalog

### Objective

Create the independent `codex-specsmd/` TypeScript project foundation and implement validated, deterministic, read-only catalog queries for movies, showtimes, and current seat availability.

### Stories in Scope

1. **001-list-movie-catalog**: Return all movies in fixture order, including the explicit empty state and typed invalid-data failures.
2. **002-list-movie-showtimes**: Return one movie's showtimes in fixture order and distinguish unknown movies from movies with no showtimes.
3. **003-view-seat-availability**: Combine auditorium layout with persisted sold-seat state without mutating either input.

### Deliverables

1. A self-contained `codex-specsmd/` npm project configured for strict TypeScript, Vitest, build, and coverage.
2. Versioned JSON fixtures for movies, showtimes, auditoriums, and initial sold-seat state.
3. Presentation-neutral domain types for movies, showtimes, formats, auditoriums, state, and seat availability.
4. Typed application errors for invalid data and unknown identifiers.
5. Boundary validation that converts untrusted JSON into trusted catalog and state values.
6. Pure query operations for listing movies, listing showtimes, and projecting seat availability.
7. Read-only filesystem adapters with injectable paths for production fixtures and isolated tests.
8. Unit and integration tests covering happy paths, empty results, malformed data, duplicate IDs, unsupported formats, unknown IDs, persisted sold seats, and inconsistent state.

### Planned Structure

```text
codex-specsmd/
  package.json
  tsconfig.json
  vitest.config.ts
  data/
    catalog.json
    state.json
  src/
    domain/
      catalog-types.ts
      errors.ts
      seat-availability.ts
    application/
      catalog-queries.ts
      ports.ts
    infrastructure/
      json-validation.ts
      json-catalog-repository.ts
      json-state-reader.ts
  tests/
    fixtures/
```

### Dependencies

1. **Node.js filesystem and path APIs**: Read UTF-8 JSON through cross-platform paths.
2. **TypeScript**: Strict compilation and explicit untrusted-boundary types.
3. **Vitest with coverage support**: Deterministic unit and adapter verification.
4. **No runtime validation library**: Keep the laboratory dependency surface small by implementing focused type guards for the fixed fixture schema.
5. **No Commander.js use in this bolt**: The catalog returns typed values; CLI integration belongs to `004-cli-application`.

### Technical Approach

1. Treat fixture and state JSON as `unknown`, validate the complete document, then expose immutable typed values.
2. Preserve array order from the catalog instead of sorting based on locale-sensitive rules.
3. Reject duplicate movie, showtime, auditorium, and seat identifiers while validating the boundary.
4. Represent formats as the closed union `2D | 3D | IMAX` and reject all other values.
5. Normalize seat labels to uppercase and reject normalized duplicates.
6. Keep query functions free of filesystem, process, Commander.js, and output formatting concerns.
7. Project availability from an immutable sold-seat set and reject state that references seats outside the selected auditorium.
8. Inject catalog and state paths so tests can use isolated temporary or fixture files.

### Acceptance Criteria

- [ ] Valid catalog data returns movies in fixture order with stable ID, title, and optional classification.
- [ ] An empty movie catalog returns an explicit successful empty collection.
- [ ] Invalid, unreadable, or duplicate fixture data returns a typed error without partial data.
- [ ] Known movies return showtimes in fixture order with ID, date/time, auditorium, and supported format.
- [ ] Unknown movies return a typed not-found error; known movies without showtimes return an empty collection.
- [ ] Known showtimes return every auditorium seat in layout order with available or sold status.
- [ ] Sold-seat state remains visible across separate reads of the same state file.
- [ ] Unknown showtimes and inconsistent state return typed errors.
- [ ] Query operations do not mutate catalog or state inputs or files.
- [ ] `npm run build`, `npm test`, and the configured coverage command pass for this unit.

### Verification Strategy

1. Run strict TypeScript compilation.
2. Run Vitest unit tests for pure validation and query behavior.
3. Run adapter tests with temporary JSON files to prove unreadable, malformed, and persistent sold-seat behavior.
4. Confirm the new project does not import or copy source code from `claude-specsmd/`.

### Out of Scope

- Commander.js commands and rendering.
- Purchase mutation, pricing, discounts, confirmations, and atomic state writes.
- Real payment, authentication, network access, or deployment.
