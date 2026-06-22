---
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
phase: inception
status: complete
unit_type: cli
default_bolt_type: simple-construction-bolt
created: 2026-06-19T00:00:00.000Z
updated: 2026-06-19T00:00:00.000Z
---

# Unit Brief: Ticketing CLI

## Purpose

The thin command/I-O layer of the cinema CLI. It loads mock data from local JSON, exposes the `billboard`, `showtimes`, `seats`, and `buy` commands via Commander.js (plus matching npm scripts), wires user input into the pure domain, prints results, and turns domain errors into clear user-facing messages with non-zero exit codes.

## Scope

### In Scope
- Loading movies/showtimes/seats from local JSON (deterministic)
- Commander.js commands: `billboard`, `showtimes --movie`, `seats --showtime`, `buy`
- Console output formatting (listings, seat maps, confirmation)
- User-facing error handling and exit codes
- CLI entry point (`src/index.ts`) and npm scripts

### Out of Scope
- Business rules (pricing, validation, discount, confirmation) — owned by 001-ticketing-domain
- Any real persistence, network, or payment

---

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-1 | View movie billboard | Must |
| FR-2 | List showtimes for a movie | Must |
| FR-3 | View available seats for a showtime | Must |
| FR-4 | Purchase one or more seats | Must |
| FR-9 | Expose CLI commands / npm scripts | Must |
| FR-10 | Deterministic, mock-data-driven behavior | Must |

---

## Domain Concepts

### Key Entities
| Entity | Description | Attributes |
|--------|-------------|------------|
| MockDataset | Loaded JSON catalog | movies, showtimes, seat layouts |
| CommandInput | Parsed CLI args | movieId, showtimeId, seatCodes, customerName |

### Key Operations
| Operation | Description | Inputs | Outputs |
|-----------|-------------|--------|---------|
| loadDataset | Read & parse mock JSON | file paths | typed in-memory dataset |
| runBillboard | Print all movies | dataset | console output |
| runShowtimes | Print showtimes for a movie | dataset, movieId | console output / error |
| runSeats | Print seat map for a showtime | dataset, showtimeId | console output / error |
| runBuy | Orchestrate a purchase | dataset, command input, domain | confirmation / error + exit code |

---

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 6 |
| Must Have | 6 |
| Should Have | 0 |
| Could Have | 0 |

### Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| 001-load-mock-data | JSON loaders | Must | Planned |
| 002-view-billboard | `billboard` command | Must | Planned |
| 003-list-showtimes | `showtimes` command | Must | Planned |
| 004-view-seats | `seats` command | Must | Planned |
| 005-buy-tickets | `buy` command | Must | Planned |
| 006-cli-entry-and-scripts | CLI entry + npm scripts | Must | Planned |

---

## Dependencies

### Depends On
| Unit | Reason |
|------|--------|
| 001-ticketing-domain | Commands call domain rules (validation, pricing, discount, confirmation) |

### Depended By
| Unit | Reason |
|------|--------|
| None | Top of the dependency graph |

### External Dependencies
| System | Purpose | Risk |
|--------|---------|------|
| Mock JSON files | Source of movies/showtimes/seats | Low (local, bundled) |

---

## Technical Context

### Suggested Technology
TypeScript (strict), Commander.js for command parsing, Node `fs` for reading JSON, `console` for output. Vitest for integration tests against fixture JSON.

### Integration Points
| Integration | Type | Protocol |
|-------------|------|----------|
| 001-ticketing-domain | Function calls | In-process |
| Mock JSON | File read | Local FS |

### Data Storage
| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| Mock catalog | JSON files | Small | Committed in repo |

---

## Constraints

- Commander.js and `console` usage confined to this unit (never the domain).
- Deterministic: no network, no wall-clock randomness affecting output (inject clock for Tuesday rule when invoking domain).

---

## Success Criteria

### Functional
- [ ] `billboard` lists movies; `showtimes` and `seats` list correctly and error on unknown IDs
- [ ] `buy` succeeds for valid available seats and prints a full confirmation
- [ ] `buy` rejects unknown/sold seats and missing args with clear messages + non-zero exit
- [ ] npm scripts exist for all four commands

### Non-Functional
- [ ] No business rules duplicated here — all delegated to the domain
- [ ] Re-running a command against unchanged data yields identical output

### Quality
- [ ] Integration tests cover the four commands against fixture JSON
- [ ] TypeScript strict passes with no `any`

---

## Bolt Suggestions

Based on stories and complexity:

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| 002-ticketing-cli | simple-construction-bolt | 001-004 | Data loading + read commands (billboard/showtimes/seats) |
| 003-ticketing-cli | simple-construction-bolt | 005-006 | Purchase flow + CLI entry & npm scripts |

---

## Notes

Splitting read commands from the purchase flow keeps each bolt small and lets the read commands land before the domain-dependent `buy` flow.
