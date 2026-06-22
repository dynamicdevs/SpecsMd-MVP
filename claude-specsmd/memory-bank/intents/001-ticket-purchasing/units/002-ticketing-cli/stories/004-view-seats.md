---
id: 004-view-seats
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 002-ticketing-cli
implemented: true
---

# Story: 004-view-seats

## User Story

**As a** CLI user
**I want** to see the available seats for a showtime
**So that** I can decide which seats to buy

## Acceptance Criteria

- [ ] **Given** a valid showtime ID, **When** I run `seats --showtime=<id>`, **Then** it shows all seats with their availability (available vs sold)
- [ ] **Given** an unknown showtime ID, **When** I run the command, **Then** it prints a clear error and exits non-zero
- [ ] **Given** the seat list, **When** it prints, **Then** sold and available seats are visually distinguishable

## Technical Notes

- Command in `src/commands/`; renders the seat layout from the dataset.
- Pure display; no booking happens here.

## Dependencies

### Requires
- 001-load-mock-data

### Enables
- 005-buy-tickets (user selects available seat codes)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Missing `--showtime` arg | Clear error + non-zero exit |
| All seats sold | Clearly indicates none available |

## Out of Scope

- Purchasing seats (005)
