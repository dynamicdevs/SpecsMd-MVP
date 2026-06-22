---
stage: plan
bolt: 003-ticketing-cli
created: 2026-06-19T18:52:00Z
---

## Implementation Plan: ticketing-cli (purchase flow + CLI entry)

### Objective

Close the end-to-end flow. Implement the `buy` use case that orchestrates the domain (validate → price → Tuesday discount → confirmation) and wire a runnable Commander.js CLI with npm scripts for all four commands, so the tool runs identically across Claude Code, Codex, and Kiro.

### Deliverables

- `src/commands/buy.ts` — `runBuy(dataset, input): string`. Resolves the movie (`UnknownMovieError`) and showtime (`UnknownShowtimeError`), calls `validateSeatSelection`, `priceSeats`, `applyTuesdayDiscount` (weekday from `showtime.startsAt`), builds the `Order`, calls `generateConfirmation`, and returns a formatted confirmation. Input: `{ movieId, showtimeId, seatCodes: string[], customerName }`.
- `src/commands/confirmation-view.ts` — `formatConfirmation(confirmation, order): string` (movie, showtime, seats, name, subtotal, discount, total, confirmation ID).
- `src/program.ts` — `buildProgram(): Command` wires `billboard`, `showtimes --movie`, `seats --showtime`, `buy --movie --showtime --seats --name`. Each action loads the dataset, calls the relevant function, and `console.log`s the result; errors are caught and printed via `console.error` with `process.exitCode = 1`.
- `src/index.ts` — CLI entry point: `buildProgram().parseAsync(process.argv)`.
- `package.json` — npm scripts: `billboard`, `showtimes`, `seats`, `buy`, `start` (run via `tsx`).

Tests (co-located):
- `src/commands/buy.test.ts` — happy path with Tuesday discount; non-Tuesday (no discount); sold seat, unknown seat, unknown movie/showtime, empty name.
- `src/program.test.ts` — `billboard` prints listing; `buy` prints a confirmation; an unknown movie sets `process.exitCode = 1` (wiring + error handling).

### Dependencies

- **commander** (runtime) — CLI parsing.
- **tsx** (dev) — run TypeScript directly for the npm scripts.
- Completed units 001 (domain) and bolt 002 (loader + read commands).

### Technical Approach

- **Console only at the edge**: `console.log`/`console.error` live in `src/program.ts` actions and `src/index.ts`; `buy.ts`/view helpers return strings and stay testable.
- **Deterministic discount**: the Tuesday rule reads `new Date(showtime.startsAt)` (data-driven), so no wall clock is involved.
- **All-or-nothing + clear errors**: domain throws typed errors; the command layer maps any `DomainError`/`CliError`/`DataError` to a clean message + non-zero exit. Commander marks `--movie/--showtime/--seats/--name` as required (missing → non-zero exit).
- **Seats arg**: `--seats=A1,A2` split on commas and trimmed before reaching the domain (which also normalizes/validates).
- **Testable program**: `buildProgram()` is exported so tests can `parseAsync([...], { from: 'user' })` and assert on captured console output / exit code, without spawning a process.

### Acceptance Criteria

- [ ] `runBuy` with valid available seats returns a confirmation containing movie title, showtime, seats, customer name, total, and confirmation ID; Tuesday total reflects 20% off (FR-4, FR-7; story 005)
- [ ] `runBuy` rejects unknown/sold seats (all-or-nothing) and empty name with typed errors naming the problem (FR-5; story 005)
- [ ] `buildProgram` exposes `billboard`, `showtimes`, `seats`, `buy` with `--help`; missing required args exit non-zero (FR-9; story 006)
- [ ] npm scripts run each command; `npm test` runs Vitest (FR-9; story 006)
- [ ] Errors print a clear message and set a non-zero exit code; success exits 0
- [ ] Full suite + strict typecheck pass
