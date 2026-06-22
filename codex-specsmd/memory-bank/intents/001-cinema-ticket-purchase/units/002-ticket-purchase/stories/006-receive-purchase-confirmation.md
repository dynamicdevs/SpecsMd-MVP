---
id: 006-receive-purchase-confirmation
unit: 002-ticket-purchase
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 003-ticket-purchase
implemented: true
---

# Story: 006-receive-purchase-confirmation

## User Story

**As a** simulated cinema customer
**I want** a complete purchase confirmation
**So that** I can verify what was bought and charged

## Acceptance Criteria

- [ ] **Given** a successful purchase, **When** confirmed, **Then** the result contains confirmation ID, customer, movie, showtime, format, seats, subtotal, discount, and total.
- [ ] **Given** successive purchases in one state file, **When** IDs are generated, **Then** a persisted monotonic sequence makes them deterministic and unique.
- [ ] **Given** a rejected or failed purchase, **When** the operation ends, **Then** no confirmation or sequence increment is persisted.

## Technical Notes

Build confirmation from committed purchase data and store the same structured values that are returned.

## Dependencies

### Requires
- 005-persist-completed-purchase

### Enables
- 003-cli-application/001-use-scriptable-commands

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| State reloaded | Confirmation fields remain identical |
| Multiple seats | Seat order is normalized and stable |

## Out of Scope

- Email, PDF, or remote delivery.
