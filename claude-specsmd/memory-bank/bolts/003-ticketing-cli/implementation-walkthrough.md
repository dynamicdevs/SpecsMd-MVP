---
stage: implement
bolt: 003-ticketing-cli
created: 2026-06-19T18:52:00Z
---

## Implementation Walkthrough: ticketing-cli (purchase flow + CLI entry)

### Summary

Implemented the `buy` use case and a runnable Commander.js CLI. `runBuy` orchestrates the pure domain (validate → price → Tuesday discount → confirmation) and returns data; the Commander program is the only place that prints and sets exit codes. A live smoke test confirmed the Tuesday IMAX purchase totals $32.00 − $6.40 = $25.60.

### Structure Overview

`src/commands/buy.ts` + `confirmation-view.ts` hold the purchase orchestration and receipt rendering (no console). `src/program.ts` wires the four commands, loads data, prints results, and maps any error to a clear message + non-zero exit. `src/index.ts` is the thin entry point. npm scripts run each command via `tsx`.

### Completed Work

- [x] `src/commands/buy.ts` - `runBuy(dataset, input)`: resolves movie/showtime, validates seats, prices by format, applies Tuesday discount, builds order + confirmation
- [x] `src/commands/confirmation-view.ts` - `formatConfirmation` receipt (movie, showtime, seats, customer, subtotal, discount, total, id)
- [x] `src/program.ts` - `buildProgram()` wiring `billboard`, `showtimes`, `seats`, `buy`; centralized error → `console.error` + `process.exitCode = 1`
- [x] `src/index.ts` - CLI entry (`buildProgram().parseAsync(process.argv)`)
- [x] `package.json` - scripts: `start`, `billboard`, `showtimes`, `seats`, `buy`

### Key Decisions

- **Console only in `program.ts`/`index.ts`**: `runBuy` and the view return strings, keeping the flow unit-testable.
- **`buildProgram()` exported**: tests drive the CLI via `parseAsync` (fast, deterministic) rather than spawning processes.
- **Data-driven discount**: weekday comes from `showtime.startsAt`, so no wall clock; results are reproducible.
- **All-or-nothing + clear errors**: domain/CLI/data errors are caught at the edge and rendered as `Error: <message>` with a non-zero exit.

### Deviations from Plan

None.

### Dependencies Added

- [x] `commander` (runtime) - CLI command/option parsing
- [x] `tsx` (dev) - run the TypeScript entry point for the npm scripts

### Developer Notes

- Run examples: `npm run billboard`; `npm run showtimes -- --movie=m1`; `npm run seats -- --showtime=st1`; `npm run buy -- --movie=m1 --showtime=st1 --seats=A1,A3 --name=Ana`.
- Tuesday showtimes in the mock data: `st1` (IMAX) and `st3` (2D); non-Tuesday: `st2` (3D), `st4` (IMAX).
