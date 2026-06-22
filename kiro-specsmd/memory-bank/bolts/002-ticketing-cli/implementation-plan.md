---
stage: plan
bolt: 002-ticketing-cli
created: 2026-06-21T14:05:00Z
---

## Implementation Plan: ticketing-cli (read commands)

### Objective
Data layer (JSON loaders) + 3 read commands: billboard, showtimes, seats.

### Deliverables
- `src/data/fixtures/movies.json` — Mock movies (3)
- `src/data/fixtures/showtimes.json` — Mock showtimes (5, includes a Tuesday)
- `src/data/fixtures/seats.json` — Mock seats (20 per showtime)
- `src/data/loader.ts` — Load JSON into domain types, merge purchase state
- `src/commands/billboard.ts` — List all movies
- `src/commands/showtimes.ts` — List showtimes for a movie
- `src/commands/seats.ts` — Show seat availability for a showtime

### Dependencies
- 001-ticketing-domain (types: Movie, Showtime, Seat)
- Node fs (readFileSync)
- Node path (cross-platform joins)

### Technical Approach
- loader receives configurable dataDir for test isolation
- Functions: loadMovies, loadShowtimes, loadSeats, loadPurchases
- Seats merge with purchases.json to reflect sold status
- Commands are pure functions receiving options + data, output to console
- Error cases: console.error + process.exitCode = 1

### Acceptance Criteria
- [ ] JSON fixtures valid and well-typed
- [ ] Loader loads data correctly, throws on missing files
- [ ] billboard shows all movies
- [ ] showtimes filters by movie, errors on invalid ID
- [ ] seats shows status, errors on invalid showtime ID
- [ ] Data dir configurable for test isolation
