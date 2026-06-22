---
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
phase: inception
status: complete
unit_type: cli
default_bolt_type: simple-construction-bolt
created: 2026-06-19T00:00:00.000Z
updated: 2026-06-19T00:00:00.000Z
---

# Unit Brief: Ticketing Domain

## Purpose

The pure, framework-free domain core of the cinema CLI. It owns the types and business rules — seat validation, format-based pricing, the Tuesday discount, and confirmation generation — with no dependency on Commander.js, `console`, or the file system. This keeps the rules fully unit-testable and identical across Claude Code, Codex, and Kiro.

## Scope

### In Scope
- Domain types: Movie, Showtime, Seat, SeatStatus, Format (2D/3D/IMAX), Order, Confirmation
- Money representation in integer cents to avoid floating-point drift
- Seat validation: reject unknown or already-sold seats; all-or-nothing
- Pricing: base + format surcharge per seat, summed across the order
- Tuesday discount: 20% off the subtotal when the showtime date is a Tuesday
- Deterministic confirmation generation (seedable ID)

### Out of Scope
- Reading JSON / file I/O (owned by 002-ticketing-cli)
- Commander.js parsing and console output (owned by 002-ticketing-cli)
- Any persistence of bookings (mock data is read-only)

---

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-5 | Reject invalid or unavailable seats (all-or-nothing) | Must |
| FR-6 | Calculate price by format (2D base, 3D +$3, IMAX +$6) | Must |
| FR-7 | Apply Tuesday discount (20% off subtotal) | Must |
| FR-8 | Generate purchase confirmation (deterministic ID) | Must |

Note: FR-5/6/7/8's rule logic lives here; the `buy` command in 002-ticketing-cli invokes it.

---

## Domain Concepts

### Key Entities
| Entity | Description | Attributes |
|--------|-------------|------------|
| Movie | A film on the billboard | id, title, formats |
| Showtime | A scheduled screening | id, movieId, startsAt (date), format, screen |
| Seat | A seat in a showtime's layout | code (e.g. B4), status (available/sold) |
| Format | Screening format | 2D \| 3D \| IMAX |
| Order | A priced selection of seats | showtime, seats, subtotalCents, discountCents, totalCents |
| Confirmation | Successful purchase result | confirmationId, movieTitle, showtime, seats, customerName, totalCents |

### Key Operations
| Operation | Description | Inputs | Outputs |
|-----------|-------------|--------|---------|
| validateSeatSelection | Ensure all requested seats exist and are available | showtime seats, requested seat codes | ok or typed error naming offending seats |
| priceSeats | Compute per-seat and subtotal by format | format, seat count, pricing config | subtotal in cents |
| applyTuesdayDiscount | Apply 20% if showtime date is Tuesday | subtotal, showtime date, clock | discount + total in cents |
| generateConfirmation | Build a deterministic confirmation | order, customer name, seed | Confirmation |

---

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 5 |
| Must Have | 5 |
| Should Have | 0 |
| Could Have | 0 |

### Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| 001-define-domain-model | Domain types & money | Must | Planned |
| 002-validate-seat-selection | Reject unknown/sold seats | Must | Planned |
| 003-calculate-format-price | 2D/3D/IMAX pricing | Must | Planned |
| 004-apply-tuesday-discount | Tuesday 20% discount | Must | Planned |
| 005-generate-confirmation | Deterministic confirmation | Must | Planned |

---

## Dependencies

### Depends On
| Unit | Reason |
|------|--------|
| None | Pure core; foundational |

### Depended By
| Unit | Reason |
|------|--------|
| 002-ticketing-cli | Commands invoke domain rules |

### External Dependencies
| System | Purpose | Risk |
|--------|---------|------|
| None | — | — |

---

## Technical Context

### Suggested Technology
TypeScript (strict). Pure functions and small typed error classes. No external runtime dependencies. Vitest for unit tests.

### Integration Points
| Integration | Type | Protocol |
|-------------|------|----------|
| 002-ticketing-cli | Function calls | In-process |

### Data Storage
| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| None | — | — | — |

---

## Constraints

- No `console`, no Commander.js, no file I/O inside this unit (enforced by coding-standards / ESLint).
- Money in integer cents; deterministic outputs; clock injectable for the Tuesday rule.

---

## Success Criteria

### Functional
- [ ] Unknown or sold seats are rejected with a specific error; valid selections pass
- [ ] Pricing correct for 2D, 3D, IMAX across seat counts
- [ ] Tuesday discount applied only on Tuesdays
- [ ] Confirmation includes all required fields with a deterministic ID

### Non-Functional
- [ ] No I/O or framework imports in `src/domain`
- [ ] Deterministic given fixed inputs + injected clock

### Quality
- [ ] Vitest unit tests cover pricing, discount, validation, confirmation
- [ ] All acceptance criteria met
- [ ] TypeScript strict passes with no `any`

---

## Bolt Suggestions

Based on stories and complexity:

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| 001-ticketing-domain | simple-construction-bolt | 001-005 | Build & test the pure domain core |

---

## Notes

This unit is the heart of the methodology comparison: the rules are small but real (validation, pricing, discount, deterministic IDs), making it a clean target for unit testing across the three IDEs.
