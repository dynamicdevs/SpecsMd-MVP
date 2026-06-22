---
intent: 001-cinema-ticket-purchase
phase: inception
status: complete
created: 2026-06-19T20:28:33.000Z
updated: 2026-06-19T20:40:43.000Z
---

# Requirements: Cinema Ticket Purchase

## Intent Overview

Build an offline, deterministic TypeScript CLI that simulates a cinema ticket purchase. The same specification serves as a small but realistic AI-DLC laboratory for Claude Code, Codex, and Kiro.

## Business Goals

| Goal | Success Metric | Priority |
|------|----------------|----------|
| Demonstrate AI-DLC end to end | Each agent can produce a functional and tested CLI from the same artifacts | Must |
| Preserve agent comparability | Identical fixture and state inputs yield equivalent observable behavior | Must |
| Exercise realistic domain behavior | The CLI completes purchasing, validation, pricing, discount, persistence, and confirmation flows | Must |
| Encourage clean design | Domain rules are pure and independent from Commander.js and filesystem adapters | Should |

## Functional Requirements

### FR-1: List the Movie Catalog

- **Description**: The CLI must list every movie from a local mock JSON catalog.
- **Acceptance Criteria**:
  - A `movies` command prints each movie's stable ID, title, and rating or classification when present.
  - Results use a deterministic order defined by the fixture.
  - An empty catalog produces a successful, explicit empty-state message.
  - Malformed or unreadable catalog data produces a concise error on stderr and a non-zero exit code.
- **Priority**: Must
- **Related Stories**: TBD

### FR-2: List Available Showtimes

- **Description**: The CLI must list mock showtimes for a selected movie.
- **Acceptance Criteria**:
  - A `showtimes <movie-id>` command prints each matching showtime's stable ID, date and time, auditorium, and format.
  - Supported formats are exactly `2D`, `3D`, and `IMAX`.
  - An unknown movie ID is rejected with a stable error and non-zero exit code.
  - A movie without showtimes produces a successful, explicit empty-state message.
  - Results use a deterministic order defined by the fixture.
- **Priority**: Must
- **Related Stories**: TBD

### FR-3: Display Seat Availability

- **Description**: The CLI must show the seat layout and current availability for a selected showtime.
- **Acceptance Criteria**:
  - A `seats <showtime-id>` command distinguishes available and sold seats.
  - Seat identifiers are stable, case-normalized labels such as `A1` and `B4`.
  - An unknown showtime ID is rejected with a stable error and non-zero exit code.
  - Availability reflects purchases stored by earlier CLI executions.
- **Priority**: Must
- **Related Stories**: TBD

### FR-4: Capture a Purchase Request

- **Description**: The CLI must accept a customer name, showtime ID, and one or more seat IDs through a `buy` command.
- **Acceptance Criteria**:
  - The command supports explicit options suitable for automated execution.
  - When required values are omitted in an interactive terminal, the command may guide the user through the same inputs.
  - The customer name must contain non-whitespace characters.
  - At least one seat must be selected.
  - Duplicate seat IDs in one request are rejected before state changes.
- **Priority**: Must
- **Related Stories**: TBD

### FR-5: Validate Selected Seats

- **Description**: The application must validate the entire seat selection before completing a purchase.
- **Acceptance Criteria**:
  - Every selected seat must exist in the selected showtime's auditorium layout.
  - Every selected seat must be available in persisted state.
  - If any seat is nonexistent, duplicated, or already sold, the whole purchase is rejected.
  - A rejected purchase does not reserve seats, create a purchase, or otherwise mutate the state file.
  - The error identifies the invalid or unavailable seat IDs without a stack trace.
- **Priority**: Must
- **Related Stories**: TBD

### FR-6: Calculate Format-Based Pricing

- **Description**: The application must calculate a subtotal using one deterministic per-seat price for each presentation format.
- **Acceptance Criteria**:
  - Default fixture prices are 2D = 8.00, 3D = 11.00, and IMAX = 15.00 in the configured currency.
  - Subtotal equals the selected showtime's per-seat price multiplied by the number of valid selected seats.
  - Monetary values are represented internally as integer minor units.
  - The calculation produces the same result regardless of operating system or locale.
  - An unsupported format is rejected before state changes.
- **Priority**: Must
- **Related Stories**: TBD

### FR-7: Apply the Tuesday Discount

- **Description**: The application must apply a deterministic Tuesday discount to eligible purchases.
- **Acceptance Criteria**:
  - A 20% discount applies when the selected showtime's fixture date falls on a Tuesday.
  - Eligibility uses the showtime date, not the machine's current date.
  - The discount applies once to the full subtotal after seat pricing.
  - The discount amount is rounded to the nearest minor currency unit using a documented half-up rule.
  - Non-Tuesday purchases receive a zero discount.
  - The subtotal, discount, and final total are exposed in the purchase result.
- **Priority**: Must
- **Related Stories**: TBD

### FR-8: Persist Purchases and Sold Seats

- **Description**: Successful purchases and their sold seats must persist in a local JSON state file across executions.
- **Acceptance Criteria**:
  - Mock catalog data remains separate from mutable purchase state.
  - A successful purchase records its confirmation ID, customer name, showtime, seats, subtotal, discount, and total.
  - All seats in a successful purchase become sold for that showtime.
  - State is written only after all validations and calculations succeed.
  - If writing fails, the command reports failure and preserves the previous valid state.
  - The state-file path can be injected so tests can use isolated temporary files.
- **Priority**: Must
- **Related Stories**: TBD

### FR-9: Generate a Purchase Confirmation

- **Description**: A successful purchase must return and persist a human-readable confirmation.
- **Acceptance Criteria**:
  - The confirmation includes a stable confirmation ID, customer name, movie, showtime, format, selected seats, subtotal, discount, and total.
  - Confirmation IDs are deterministic and unique within one state file, using a persisted sequence rather than randomness.
  - Reopening the state file preserves the same confirmation data.
  - No confirmation is generated for a rejected purchase.
- **Priority**: Must
- **Related Stories**: TBD

### FR-10: Provide Stable CLI Behavior

- **Description**: All capabilities must be exposed through Commander.js commands with scriptable behavior.
- **Acceptance Criteria**:
  - The CLI provides help for `movies`, `showtimes`, `seats`, and `buy`.
  - Successful commands return exit code `0`.
  - Invalid input, unavailable seats, corrupt data, and persistence failures return non-zero exit codes.
  - Normal results go to stdout and errors go to stderr.
  - Explicit command options never require interactive input.
- **Priority**: Must
- **Related Stories**: TBD

## Non-Functional Requirements

### NFR-1: Offline Operation

- **Metric**: External network dependencies during application execution
- **Target**: Zero; every user flow works with local JSON files only

### NFR-2: Cross-Platform Compatibility

- **Metric**: Supported operating-system families
- **Target**: Automated build and tests pass on Windows, macOS, and Linux using a maintained Node.js LTS release

### NFR-3: Determinism and Comparability

- **Metric**: Observable differences for identical catalog, state, and command input
- **Target**: Zero differences in domain results, exit status, persisted state semantics, and required output fields

### NFR-4: Test Isolation

- **Metric**: Tests dependent on shared mutable state or execution order
- **Target**: Zero; each test uses resettable fixtures and a unique temporary state file

### NFR-5: Domain Separation

- **Metric**: Domain modules importing Commander.js or Node.js filesystem APIs
- **Target**: Zero; domain pricing, discount, validation, and purchase rules remain pure

### NFR-6: Performance

- **Metric**: p95 command completion time against the bundled small fixture, excluding process startup
- **Target**: Less than 200 ms on a typical development machine

### NFR-7: Automated Quality

- **Metric**: Test coverage and required automated checks
- **Target**: At least 80% overall coverage, 100% branch coverage for pricing and Tuesday-discount rules, with `npm run build` and `npm test` passing

### NFR-8: State Integrity

- **Metric**: Partial purchases or corrupted state caused by a rejected or failed operation
- **Target**: Zero; writes use a replace-safe strategy and failed operations preserve the previous valid state

## Constraints

### Technical Constraints

- TypeScript, Commander.js, npm scripts, and Vitest are required.
- Catalog, showtimes, auditorium layouts, and mutable state use local JSON files.
- Application behavior must not require APIs, databases, browsers, or network connectivity.

### Business Constraints

- The scope must remain small enough for equivalent implementation by Claude Code, Codex, and Kiro.
- Payment is simulated; no financial transaction is performed.
- Authentication, accounts, web UI, and deployment are out of scope.

## Assumptions

| Assumption | Risk if Invalid | Mitigation |
|------------|-----------------|------------|
| One CLI process writes a state file at a time | Concurrent processes could sell the same seat | Document the single-writer MVP boundary and isolate persistence for future locking |
| Fixture dates include at least one Tuesday | The discount cannot be demonstrated | Include eligible and ineligible showtimes in shared fixtures |
| One configured currency is sufficient | Multi-currency behavior would expand pricing rules | Store currency with prices and keep conversion out of scope |
| Agent implementations consume equivalent fixtures | Results may not be comparable | Version the shared JSON fixtures with the specification |

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| Confirm default prices of 8.00, 11.00, and 15.00 | Product owner | Before approval | Resolved: approved |
| Confirm Tuesday discount of 20% | Product owner | Before approval | Resolved: approved |
| Confirm single-process write boundary | Product owner | Before approval | Resolved: approved |
