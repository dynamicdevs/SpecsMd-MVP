---
intent: 001-ticket-purchasing
phase: inception
status: complete
created: 2026-06-19T00:00:00.000Z
updated: 2026-06-19T00:00:00.000Z
---

# Requirements: Ticket Purchasing

## Intent Overview

A small, local, framework-free CLI that runs a complete cinema ticket-purchasing flow against mock JSON data: view a movie billboard, list showtimes per movie, view available seats, purchase one or more seats (with validation), price tickets by format (2D / 3D / IMAX), apply a simple Tuesday discount, and generate a purchase confirmation. The intent exists to exercise the specsmd AI-DLC methodology identically across Claude Code, Codex, and Kiro.

## Business Goals

| Goal | Success Metric | Priority |
|------|----------------|----------|
| Validate AI-DLC across three agentic IDEs | Same intent runs end-to-end in Claude Code, Codex, and Kiro | Must |
| Keep the case small and reproducible | Runs locally via npm scripts, no external services, deterministic | Must |
| Exercise realistic domain logic | Pricing, seat validation, discount, confirmation are unit-tested | Must |

---

## Functional Requirements

### FR-1: View Movie Billboard
- **Description**: The CLI displays the billboard of available movies from mock JSON, showing at minimum movie ID, title, and format(s).
- **Acceptance Criteria**: The `billboard` command lists every movie in the mock data with ID and title; exits 0 when data is present.
- **Priority**: Must
- **Related Stories**: TBD

### FR-2: List Showtimes for a Movie
- **Description**: Given a movie ID, the CLI lists that movie's showtimes (showtime ID, date/time, format, screen/auditorium).
- **Acceptance Criteria**: `showtimes --movie=<id>` lists all showtimes for that movie; an unknown movie ID produces a clear user-facing error and non-zero exit.
- **Priority**: Must
- **Related Stories**: TBD

### FR-3: View Available Seats for a Showtime
- **Description**: Given a showtime ID, the CLI shows the seat map / list of seats, distinguishing available vs. sold.
- **Acceptance Criteria**: `seats --showtime=<id>` shows all seats with availability state; unknown showtime ID → clear error + non-zero exit.
- **Priority**: Must
- **Related Stories**: TBD

### FR-4: Purchase One or More Seats
- **Description**: A user purchases seats by providing movie ID, showtime ID, one or more seat codes, and a customer name.
- **Acceptance Criteria**: `buy --movie=<id> --showtime=<id> --seats=B4,B5 --name="Ana"` succeeds when all seats exist and are available, returning a confirmation; missing required args → clear error + non-zero exit.
- **Priority**: Must
- **Related Stories**: TBD

### FR-5: Reject Invalid or Unavailable Seats
- **Description**: The system rejects a purchase if any requested seat does not exist or is already sold. The purchase is all-or-nothing (no partial booking).
- **Acceptance Criteria**: If any seat code is unknown or already sold, no seats are booked, a specific error names the offending seat(s), and exit is non-zero.
- **Priority**: Must
- **Related Stories**: TBD

### FR-6: Calculate Price by Format
- **Description**: Ticket price is computed per seat from a base price plus a format surcharge: 2D = base; 3D = base + 3D surcharge; IMAX = base + IMAX surcharge (IMAX surcharge > 3D surcharge). Order total = sum over seats.
- **Acceptance Criteria**: For N seats of a given format, total (pre-discount) = N × (base + surcharge for that format); verified by unit tests for all three formats.
- **Priority**: Must
- **Pricing (approved)**: base = $10.00, 3D surcharge = +$3.00, IMAX surcharge = +$6.00, currency USD.
- **Related Stories**: TBD

### FR-7: Apply Tuesday Discount
- **Description**: When the showtime falls on a Tuesday, a flat percentage discount is applied to the order subtotal.
- **Acceptance Criteria**: For a Tuesday showtime, total = subtotal × (1 − discount); for any other day, no discount; verified by unit tests.
- **Priority**: Must
- **Discount (approved)**: Tuesday = 20% off the order subtotal.
- **Related Stories**: TBD

### FR-8: Generate Purchase Confirmation
- **Description**: On a successful purchase the system produces a confirmation containing movie title, showtime, seats, customer name, total amount, and a confirmation ID.
- **Acceptance Criteria**: Confirmation output includes all six fields; the confirmation ID is generated deterministically/seedable so tests are reproducible.
- **Priority**: Must
- **Related Stories**: TBD

### FR-9: Expose CLI Commands / npm Scripts
- **Description**: The CLI exposes commands (and matching npm scripts) for: view billboard, list showtimes, view seats, and buy tickets.
- **Acceptance Criteria**: `npm run` scripts (or `node`/`tsx` invocations) exist and work for `billboard`, `showtimes`, `seats`, and `buy`.
- **Priority**: Must
- **Related Stories**: TBD

### FR-10: Deterministic, Mock-Data-Driven Behavior
- **Description**: All flows run against local JSON mock data with no randomness affecting outcomes (seat state, prices, and confirmation IDs are deterministic given inputs).
- **Acceptance Criteria**: Re-running the same command against unchanged data yields identical output; tests rely on no network/clock nondeterminism (clock injectable for the Tuesday rule).
- **Priority**: Must
- **Related Stories**: TBD

---

## Non-Functional Requirements

### NFR-1: Architecture / Maintainability
| Requirement | Standard | Notes |
|-------------|----------|-------|
| Pure domain | coding-standards | `src/domain` has no Commander.js, no `console`, no file I/O |
| Layer separation | coding-standards | Parsing, console output, user-facing errors live only in command layer |

### NFR-2: Quality / Testability
| Requirement | Metric | Target |
|-------------|--------|--------|
| Type safety | tsconfig | strict mode enabled |
| Unit coverage | Vitest | pricing (2D/3D/IMAX), Tuesday discount, seat validation (unknown + sold), confirmation generation |

### NFR-3: Portability
| Requirement | Metric | Target |
|-------------|--------|--------|
| Runnable | npm scripts | local, framework-free, no network/external services |
| Comparable | scope | small enough to compare Claude Code, Codex, Kiro fairly |

### NFR-4: Error Handling
| Requirement | Standard | Notes |
|-------------|----------|-------|
| Typed domain errors | coding-standards | Domain throws typed errors; command layer prints clear message + non-zero exit |

---

## Constraints

### Technical Constraints

**Project-wide standards**: loaded from `memory-bank/standards/` (tech-stack, coding-standards) by the Construction Agent.

**Intent-specific constraints**:
- Mock data stored as local JSON files
- Injectable clock for the Tuesday rule (deterministic tests)
- All-or-nothing purchases (no partial booking)
- Seedable / deterministic confirmation IDs

### Business Constraints
- Must stay small enough to run and compare identically across Claude Code, Codex, and Kiro

---

## Non-Goals

- No real payment integration
- No authentication
- No real database
- No external APIs
- No web frontend
- No deployment

---

## Assumptions

| Assumption | Risk if Invalid | Mitigation |
|------------|-----------------|------------|
| Seats identified by codes like `B4` (row letter + number) | Seat selection/validation mismatch | Mock data defines each showtime's seat layout |
| Each showtime's mock data marks pre-sold seats | Cannot exercise rejection path | Pre-mark some seats as sold in mock JSON |
| "Tuesday" derived from showtime date | Discount applies incorrectly | Inject clock / use showtime date in tests |

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| Exact pricing/discount rules | user | inception | Resolved: base $10, 3D +$3, IMAX +$6, Tuesday 20% |
