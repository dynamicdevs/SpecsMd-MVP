---
id: 004-view-seats
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 002-ticketing-cli
implemented: false
---

# Story: 004-view-seats

## User Story

**As a** buyer
**I want** to see which seats are available for a showtime
**So that** I can choose where to sit before purchasing

## Acceptance Criteria

- [ ] **Given** a valid showtime ID, **When** `seats --showtime <id>` is executed, **Then** lists all seats with row, number, and status (free/sold)
- [ ] **Given** an invalid showtime ID, **When** `seats --showtime <id>` is executed, **Then** displays error and exit code 1
- [ ] **Given** --showtime option is missing, **When** `seats` is executed, **Then** displays usage help and exit code 1
- [ ] **Given** previous purchases exist, **When** `seats` is called, **Then** those seats show as "sold"

## Technical Notes

- Command: `cinema seats --showtime <showtimeId>`
- Shows free seats distinctly from sold seats
- Reflects persisted purchases

## Dependencies

### Requires
- 001-load-mock-data (needs seats + purchase state)

### Enables
- User knows which seat IDs to pass to `buy`
