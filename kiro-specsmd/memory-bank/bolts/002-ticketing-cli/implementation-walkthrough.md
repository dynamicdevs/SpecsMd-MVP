---
stage: implement
bolt: 002-ticketing-cli
created: 2026-06-21T14:08:00Z
---

## Implementation Walkthrough: ticketing-cli (read commands)

### Summary

Data loading layer from JSON fixtures + 3 CLI commands for browsing movies, showtimes, and seat availability.

### Structure Overview

Data fixtures in `src/data/fixtures/`, loader in `src/data/loader.ts`, commands as individual modules in `src/commands/`.

### Completed Work

- [x] `src/data/fixtures/movies.json` - 3 movies with varied formats
- [x] `src/data/fixtures/showtimes.json` - 5 showtimes including a Tuesday (for discount testing)
- [x] `src/data/fixtures/seats.json` - 20 seats per showtime (4 rows × 5)
- [x] `src/data/loader.ts` - Loads JSON, merges purchase history into seat status, configurable data dir
- [x] `src/commands/billboard.ts` - Lists all movies with formats
- [x] `src/commands/showtimes.ts` - Filters showtimes by movie ID
- [x] `src/commands/seats.ts` - Shows seat availability with free/sold counts

### Key Decisions

- **Configurable dataDir**: Loader accepts path parameter for test isolation
- **purchases.json optional**: Returns empty array if not found (first run has no purchases)
- **Sync reads**: CLI tool doesn't need async — simplicity over performance
- **Commands receive DataStore**: Pure dependency injection, easy to test with mock data

### Deviations from Plan

None

### Dependencies Added

None (uses only Node built-ins and domain types)

### Developer Notes

- Seats JSON keyed by showtime ID for fast lookup
- `import.meta.dirname` used in tests for portable fixture paths
