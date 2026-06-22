---
stage: implement
bolt: 003-ticketing-cli
created: 2026-06-21T14:14:00Z
---

## Implementation Walkthrough: ticketing-cli (buy + entry point)

### Summary

Buy command implementing the full purchase flow, persistence layer for JSON storage, and Commander.js entry point wiring all 4 subcommands with npm scripts.

### Structure Overview

Buy command orchestrates domain functions (validate → price → discount → confirm → persist). Entry point registers all subcommands under a single `cinema` program.

### Completed Work

- [x] `src/commands/buy.ts` - Full purchase flow: validate, price, discount, confirm, persist, display
- [x] `src/data/persistence.ts` - Read-modify-write purchases.json with showtime tracking
- [x] `src/index.ts` - Commander.js program with billboard, showtimes, seats, buy subcommands
- [x] `data/` - Project-root data directory for runtime fixtures
- [x] `package.json` - npm scripts: billboard, showtimes, seats, buy, build, test

### Key Decisions

- **Data dir at project root**: Fixtures live in `data/` (not `src/`) so compiled dist/ can find them via relative path `../data`
- **savePurchaseWithShowtime**: Explicit showtimeId param ensures proper seat merging on reload
- **Commander requiredOption**: Leverages Commander's built-in validation for missing args

### Deviations from Plan

- Moved fixtures from `src/data/fixtures/` to `data/` at project root for simpler path resolution from both src and dist

### Dependencies Added

None new (Commander already installed)

### Developer Notes

- `import.meta.url` + `dirname` used for portable path resolution in ESM
- Purchase persistence is read-modify-write (not append-only) for JSON readability
