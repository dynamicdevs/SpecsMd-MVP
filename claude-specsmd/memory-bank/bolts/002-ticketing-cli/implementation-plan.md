---
stage: plan
bolt: 002-ticketing-cli
created: 2026-06-19T18:45:00Z
---

## Implementation Plan: ticketing-cli (data + read commands)

### Objective

Deliver the data layer and the three read-only commands — `billboard`, `showtimes`, `seats` — that let a user browse movies, showtimes, and seat availability against deterministic local JSON. Business rules stay in the domain; this bolt only loads data and renders output.

### Deliverables

Mock data (local JSON, deterministic, committed):
- `src/data/movies.json` — 3 movies with formats.
- `src/data/showtimes.json` — 4 showtimes (mix of 2D/3D/IMAX; some on a Tuesday `2026-06-23`, some not), each with an embedded seat layout and a couple of pre-sold seats.

Source modules:
- `src/data/loader.ts` — `loadDataset(dataDir?)` reads & validates the JSON into a typed `Dataset { movies, showtimes }`; throws a typed `DataError` naming the bad file on missing/malformed input. Only place that touches the file system.
- `src/commands/errors.ts` — CLI-layer typed errors: `UnknownMovieError`, `UnknownShowtimeError` (data-lookup failures, distinct from domain errors).
- `src/commands/billboard.ts` — `formatBillboard(dataset): string`.
- `src/commands/showtimes.ts` — `formatShowtimes(dataset, movieId): string` (throws `UnknownMovieError`).
- `src/commands/seats.ts` — `formatSeats(dataset, showtimeId): string` (throws `UnknownShowtimeError`; marks available vs sold).
- `src/commands/format.ts` — small shared helpers (e.g. render cents as `$X.XX`, seat-map rendering).

Tests (co-located `*.test.ts`):
- Loader: loads the real `src/data` dataset; errors on a non-existent dir / malformed fixture.
- Commands: billboard lists all movies; showtimes lists/handles unknown movie; seats renders availability/handles unknown showtime.

### Dependencies

- **Unit 001-ticketing-domain (complete)** — imports `Movie`, `Showtime`, `Seat`, `Format` types from `src/domain`.
- Node built-ins `node:fs`, `node:path`, `node:url` for reading JSON (allowed outside the domain).
- No new npm packages (Commander.js is wired in bolt 003).

### Technical Approach

- **Command functions return strings** rather than calling `console` directly, so they are unit-testable without capturing stdout. The Commander wiring + actual `console.log` lands in bolt 003 (`src/index.ts`). This keeps `console` at the very edge and honors the layer-separation standard.
- **Loader** resolves a default data dir from `import.meta.url` (so it works under tsx/compiled output); validates that arrays exist and that each record has required fields and a valid `format`/seat `status`. Invalid shape → `DataError` naming the file.
- **Lookup errors** (`UnknownMovieError`, `UnknownShowtimeError`) live in the command layer; they carry the offending id for clear messages.
- **Determinism**: pure data → identical rendered strings for unchanged JSON.

### Acceptance Criteria

- [ ] `loadDataset` returns a typed dataset from `src/data/*.json`; missing/malformed input throws `DataError` naming the file (FR-10; story 001)
- [ ] `formatBillboard` lists every movie with id, title, and formats (FR-1; story 002)
- [ ] `formatShowtimes` lists a movie's showtimes (id, time, format, screen); unknown movie id → `UnknownMovieError` (FR-2; story 003)
- [ ] `formatSeats` shows all seats for a showtime distinguishing available vs sold; unknown showtime id → `UnknownShowtimeError` (FR-3; story 004)
- [ ] Re-running against unchanged data yields identical output; no business rules duplicated from the domain
- [ ] Vitest tests cover loader + the three commands and pass; strict typecheck clean

### Note for reviewer

This bolt delivers tested command + loader **functions**, not yet runnable via `npm run billboard`. The Commander entry point and npm scripts (FR-9) are story 006 in bolt 003, which will wire these functions to the CLI.
