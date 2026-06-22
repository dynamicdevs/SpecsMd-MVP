---
id: 002-validate-seat-selection
unit: 002-ticket-purchase
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 002-ticket-purchase
implemented: true
---

# Story: 002-validate-seat-selection

## User Story

**As a** simulated cinema customer
**I want** all selected seats validated together
**So that** I never receive a partial purchase

## Acceptance Criteria

- [ ] **Given** valid available seats, **When** validated, **Then** the complete normalized selection succeeds.
- [ ] **Given** any nonexistent or sold seat, **When** validated, **Then** the whole selection fails and identifies all offending seats.
- [ ] **Given** failed validation, **When** the use case ends, **Then** neither purchases nor sold seats nor sequence values change.

## Technical Notes

Validate against the auditorium layout and an immutable prior-state snapshot.

## Dependencies

### Requires
- 001-submit-purchase-request
- 001-cinema-catalog/003-view-seat-availability

### Enables
- 003-calculate-format-pricing
- 005-persist-completed-purchase

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Mixed valid and invalid seats | Reject all |
| Seat already sold | Report unavailable and preserve state |

## Out of Scope

- Cross-process locking.
