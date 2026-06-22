---
intent: 001-ticket-purchasing
phase: inception
status: units-decomposed
updated: 2026-06-19T00:00:00Z
---

# Ticket Purchasing - Unit Decomposition

## Units Overview

This intent decomposes into **2 units of work**, drawn along the architecture boundary required by the coding standards: a pure domain core and a thin CLI/command layer.

### Unit 1: 001-ticketing-domain

**Description**: Pure, framework-free domain core. Defines the types (Movie, Showtime, Seat, Format, Order, Confirmation) and the business rules: seat validation (unknown / sold, all-or-nothing), format pricing (2D/3D/IMAX), the Tuesday discount, and deterministic confirmation generation. No Commander.js, no `console`, no file I/O.

**Stories**:

- 001-define-domain-model: Domain types & money handling
- 002-validate-seat-selection: Reject unknown/sold seats (all-or-nothing)
- 003-calculate-format-price: 2D/3D/IMAX pricing
- 004-apply-tuesday-discount: 20% Tuesday discount
- 005-generate-confirmation: Deterministic purchase confirmation

**Deliverables**:

- `src/domain/` pure modules + Vitest unit tests

**Dependencies**:

- Depends on: None
- Depended by: 002-ticketing-cli

**Estimated Complexity**: M

### Unit 2: 002-ticketing-cli

**Description**: The Commander.js command layer and mock-data loaders. Loads movies/showtimes/seats from local JSON, exposes the `billboard`, `showtimes`, `seats`, and `buy` commands (plus npm scripts), wires user input into the domain, prints results, and presents domain errors as clear user-facing messages with non-zero exit codes.

**Stories**:

- 001-load-mock-data: JSON loaders for movies/showtimes/seats
- 002-view-billboard: `billboard` command
- 003-list-showtimes: `showtimes --movie` command
- 004-view-seats: `seats --showtime` command
- 005-buy-tickets: `buy` command (orchestrates domain + confirmation)
- 006-cli-entry-and-scripts: CLI entry point + npm scripts

**Deliverables**:

- `src/commands/`, `src/data/`, `src/index.ts`, mock JSON, npm scripts, integration tests

**Dependencies**:

- Depends on: 001-ticketing-domain
- Depended by: None

**Estimated Complexity**: M

## Unit Dependency Graph

```text
[001-ticketing-domain] ──> [002-ticketing-cli]
```

## Execution Order

Based on dependencies:

1. 001-ticketing-domain (pure core, no dependencies)
2. 002-ticketing-cli (consumes the domain, adds I/O and commands)
