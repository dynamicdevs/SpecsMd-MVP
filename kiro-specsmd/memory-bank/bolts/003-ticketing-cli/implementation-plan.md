---
stage: plan
bolt: 003-ticketing-cli
created: 2026-06-21T14:10:00Z
---

## Implementation Plan: ticketing-cli (buy + entry point)

### Objective
Implement the `buy` command (full purchase flow) and wire the Commander.js entry point with npm scripts.

### Deliverables
- `src/commands/buy.ts` — Buy command: validate → price → discount → confirm → persist
- `src/data/persistence.ts` — Save purchases to JSON, update seat state
- `src/index.ts` — Commander.js entry point with all subcommands
- Updated `package.json` — npm scripts for all commands

### Dependencies
- 001-ticketing-domain (validateSeats, calculatePrice, applyDiscount, generateConfirmation)
- 002-ticketing-cli (loadData, DataStore)
- Commander.js

### Technical Approach
- buy command accepts: --showtime, --seats (comma-separated), --customer
- Orchestration: load data → find showtime → validate seats → calculate price → apply discount → generate confirmation → persist
- persistence.ts: appendPurchase to purchases.json (read-modify-write)
- Entry point: Commander program with billboard, showtimes, seats, buy subcommands
- npm scripts: billboard, showtimes, seats, buy, test, build

### Acceptance Criteria
- [ ] buy succeeds for valid seats, prints confirmation, exit code 0
- [ ] buy rejects invalid/sold seats with clear error, exit code 1
- [ ] buy rejects missing arguments with usage help
- [ ] Tuesday discount reflected in confirmation
- [ ] Purchase persisted to purchases.json
- [ ] Subsequent seats command shows purchased seats as sold
- [ ] npm scripts work for all commands
- [ ] npm test runs vitest
