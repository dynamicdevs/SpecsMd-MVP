---
stage: implement
bolt: 002-ticketing-cli
created: 2026-06-19T18:45:00Z
---

## Implementation Walkthrough: ticketing-cli (data + read commands)

### Summary

Implemented the data layer and the three read-only command renderers (billboard, showtimes, seats) against deterministic mock JSON. Commands return formatted strings and contain no `console`; the loader is the only code that touches the file system. Typecheck passes under strict mode.

### Structure Overview

`src/data/` holds the mock JSON catalog plus a validating loader that parses it into typed `Movie`/`Showtime` records (reusing the domain types). `src/commands/` holds small pure renderers and command-layer lookup errors. No business rules are duplicated from the domain.

### Completed Work

- [x] `src/data/movies.json` - 3 movies with formats
- [x] `src/data/showtimes.json` - 4 showtimes (mixed 2D/3D/IMAX; st1/st3 on Tuesday 2026-06-23; pre-sold seats) with embedded seat layouts
- [x] `src/data/loader.ts` - `loadDataset(dataDir?)` reads + validates JSON into `Dataset`; throws `DataError` naming the bad file; default dir resolved from `import.meta.url`
- [x] `src/commands/errors.ts` - `CliError` base + `UnknownMovieError` / `UnknownShowtimeError`
- [x] `src/commands/format.ts` - `formatMoney` (cents → `$X.XX`)
- [x] `src/commands/billboard.ts` - `formatBillboard(dataset)`
- [x] `src/commands/showtimes.ts` - `formatShowtimes(dataset, movieId)` (throws on unknown movie; shows available seat counts)
- [x] `src/commands/seats.ts` - `formatSeats(dataset, showtimeId)` (throws on unknown showtime; O/X seat map + available list)

### Key Decisions

- **Commands return strings, not `console` output**: keeps them unit-testable and confines printing to the (bolt 003) entry point.
- **Validating loader**: narrows `unknown` → typed records and rejects malformed data with a `DataError` naming the file, rather than trusting the JSON blindly.
- **Lookup errors in the command layer**: `UnknownMovie/ShowtimeError` are about locating records, separate from the domain's seat/pricing errors.
- **Mock data doubles as bolt-003 fixtures**: Tuesday vs non-Tuesday showtimes and pre-sold seats let the upcoming `buy` flow exercise discount and rejection paths.

### Deviations from Plan

None.

### Dependencies Added

- [x] `@types/node` (dev) - type declarations for `node:fs`/`node:path`/`node:url` used by the loader

### Developer Notes

- Tests are authored and run in Stage 3.
- `formatMoney` is added here but is primarily for bolt 003's confirmation output; it lives in the command layer with the other renderers.
