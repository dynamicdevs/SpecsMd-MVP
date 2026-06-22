---
id: 005-buy-tickets
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 003-ticketing-cli
implemented: true
---

# Story: 005-buy-tickets

## User Story

**As a** CLI user
**I want** to purchase one or more seats for a showtime
**So that** I receive a confirmation for my booking

## Acceptance Criteria

- [ ] **Given** valid movie ID, showtime ID, available seat codes, and a customer name, **When** I run `buy --movie=<id> --showtime=<id> --seats=B4,B5 --name="Ana"`, **Then** the tool validates, prices, applies any Tuesday discount, and prints a confirmation with movie title, showtime, seats, customer name, total, and confirmation ID
- [ ] **Given** any seat that does not exist or is already sold, **When** I run `buy`, **Then** no booking occurs, the offending seat(s) are named, and the command exits non-zero (all-or-nothing)
- [ ] **Given** a missing required argument, **When** I run `buy`, **Then** a clear error explains what's missing and the command exits non-zero
- [ ] **Given** a Tuesday showtime, **When** I run `buy`, **Then** the printed total reflects the 20% discount

## Technical Notes

- Command in `src/commands/`; orchestrates loader + domain (validate → price → discount → confirmation).
- Catch typed domain errors and present them as user-facing messages; set non-zero exit code.
- Inject the showtime date into the discount rule for deterministic behavior.

## Dependencies

### Requires
- 001-load-mock-data, 001-ticketing-domain (validation, pricing, discount, confirmation)

### Enables
- None (terminal flow)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Mixed valid + sold seats | Whole purchase rejected (all-or-nothing) |
| Empty `--name` | Clear validation error + non-zero exit |
| Duplicate seat codes | Rejected with a clear error |

## Out of Scope

- Real payment / persistence (non-goals)
