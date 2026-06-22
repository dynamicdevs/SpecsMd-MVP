---
unit: 002-ticket-purchase
intent: 001-cinema-ticket-purchase
phase: inception
status: complete
unit_type: cli
default_bolt_type: simple-construction-bolt
created: 2026-06-19T20:34:24.000Z
updated: 2026-06-19T20:34:24.000Z
---

# Unit Brief: Ticket Purchase

## Purpose

Execute an all-or-nothing cinema purchase using pure validation, pricing, and discount rules, then persist sold seats and a deterministic confirmation.

## Scope

### In Scope

- Purchase request validation and normalization.
- Seat existence and availability rules.
- Format pricing and Tuesday discount.
- Atomic local state update and confirmation generation.

### Out of Scope

- Real payments, customer accounts, concurrency across writer processes, and CLI presentation.

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-4 | Capture a purchase request | Must |
| FR-5 | Validate selected seats | Must |
| FR-6 | Calculate format-based pricing | Must |
| FR-7 | Apply the Tuesday discount | Must |
| FR-8 | Persist purchases and sold seats | Must |
| FR-9 | Generate a purchase confirmation | Must |

## Domain Concepts

| Entity | Description | Attributes |
|--------|-------------|------------|
| PurchaseRequest | Validated purchase input | customer, showtime ID, seats |
| Money | Exact currency amount | minor units, currency |
| Purchase | Completed transaction simulation | pricing, seats, confirmation ID |
| CinemaState | Mutable local state | sold seats, purchases, next sequence |

## Key Operations

| Operation | Inputs | Outputs |
|-----------|--------|---------|
| validateSeatSelection | request, showtime, state | normalized valid seats or typed errors |
| calculatePrice | format, seat count, showtime date | subtotal, discount, total |
| completePurchase | request, catalog, prior state | confirmation and next state |
| persistState | prior state, next state | atomically stored state or error |

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
| 001-submit-purchase-request | Submit purchase request | Must | Planned |
| 002-validate-seat-selection | Validate seat selection | Must | Planned |
| 003-calculate-format-pricing | Calculate format pricing | Must | Planned |
| 004-apply-tuesday-discount | Apply Tuesday discount | Must | Planned |
| 005-persist-completed-purchase | Persist completed purchase | Must | Planned |
| 006-receive-purchase-confirmation | Receive purchase confirmation | Must | Planned |

## Dependencies

### Depends On

- `001-cinema-catalog`: Validated movie, showtime, format, and auditorium concepts.

### Depended By

- `003-cli-application`: Invokes the purchase use case and renders its result.

### External Dependencies

- Local state JSON; medium risk because writes must preserve integrity.

## Technical Context

- Domain rules are pure TypeScript and use integer minor units.
- Persistence is behind an injected repository interface.
- The JSON adapter writes a temporary file and safely replaces the prior state.

## Constraints

- Tuesday eligibility comes from the showtime fixture date.
- Prices are 800, 1100, and 1500 minor units; discount is 20% half-up.
- Confirmation IDs use a persisted monotonic sequence.
- The MVP supports one writer process per state file.

## Success Criteria

- [ ] Valid purchases complete and persist across invocations.
- [ ] Invalid, duplicate, or occupied seats cause no mutation.
- [ ] Pricing and discounts are deterministic and fully branch-tested.
- [ ] Persistence failure preserves the previous valid state.
- [ ] Confirmation contains every required field.

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| 002-ticket-purchase | Simple | 001-004 | Implement request, validation, pricing, and discount rules |
| 003-ticket-purchase | Simple | 005-006 | Implement atomic persistence and confirmation |
