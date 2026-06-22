---
id: 005-buy-tickets
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 003-ticketing-cli
implemented: false
---

# Story: 005-buy-tickets

## User Story

**As a** buyer
**I want** to purchase tickets by specifying showtime, seats, and my name
**So that** I get a confirmed reservation

## Acceptance Criteria

- [ ] **Given** valid showtime, free seats, and customer name, **When** `buy` is executed, **Then** prints confirmation with all details and exit code 0
- [ ] **Given** an invalid seat, **When** `buy` is executed, **Then** prints error and exit code 1
- [ ] **Given** a sold seat, **When** `buy` is executed, **Then** prints error and exit code 1
- [ ] **Given** missing arguments, **When** `buy` is executed, **Then** shows usage help and exit code 1
- [ ] **Given** a Tuesday showtime, **When** `buy` is executed, **Then** confirmation shows discount applied
- [ ] **Given** a successful purchase, **When** `seats` is called again, **Then** those seats appear as sold

## Technical Notes

- Command: `cinema buy --showtime <id> --seats <s1,s2,...> --customer <name>`
- Orchestration: loadData → validateSeats → calculatePrice → applyDiscount → generateConfirmation → savePurchase
- Calls domain functions from 001-ticketing-domain
- Persists to purchases.json

## Dependencies

### Requires
- 001-load-mock-data (data loading)
- 001-ticketing-domain unit (all domain functions)

### Enables
- None (final user action)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Customer name with spaces | Works fine (quoted in shell) |
| Single seat purchase | Works |
| All seats in room purchased | Next buy fails for any seat |
