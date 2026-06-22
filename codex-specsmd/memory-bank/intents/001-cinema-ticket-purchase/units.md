---
intent: 001-cinema-ticket-purchase
phase: inception
status: units-decomposed
updated: 2026-06-19T20:34:24Z
---

# Cinema Ticket Purchase - Unit Decomposition

## Units Overview

This CLI intent decomposes into three command-oriented units.

### Unit 1: 001-cinema-catalog

**Description**: Provides deterministic read-only discovery of movies, showtimes, and current seat availability.

**Assigned Requirements**: FR-1, FR-2, FR-3

**Deliverables**: Catalog queries, seat availability projection, and query-facing application interfaces.

**Dependencies**: None. Depended on by `003-cli-application`.

**Estimated Complexity**: M

### Unit 2: 002-ticket-purchase

**Description**: Owns purchase validation, pricing, discounting, persistence, and confirmation behavior.

**Assigned Requirements**: FR-4, FR-5, FR-6, FR-7, FR-8, FR-9

**Deliverables**: Pure purchase domain rules, purchase use case, state repository port and JSON adapter, confirmation result.

**Dependencies**: Uses the shared fixture contract established by `001-cinema-catalog`. Depended on by `003-cli-application`.

**Estimated Complexity**: L

### Unit 3: 003-cli-application

**Description**: Exposes the catalog and purchase use cases through stable Commander.js commands.

**Assigned Requirements**: FR-10

**Deliverables**: CLI entry point, command adapters, deterministic output and error mapping, npm execution scripts.

**Dependencies**: `001-cinema-catalog`, `002-ticket-purchase`.

**Estimated Complexity**: M

## Requirement-to-Unit Mapping

- **FR-1** through **FR-3** → `001-cinema-catalog`
- **FR-4** through **FR-9** → `002-ticket-purchase`
- **FR-10** → `003-cli-application`

Each functional requirement is assigned to exactly one unit.

## Unit Dependency Graph

```text
[001-cinema-catalog] -----> [002-ticket-purchase]
          |                          |
          +----------+---------------+
                     v
             [003-cli-application]
```

## Execution Order

1. Build `001-cinema-catalog` as the fixture and discovery foundation.
2. Build `002-ticket-purchase` against the shared catalog contract.
3. Integrate both behind `003-cli-application`.
