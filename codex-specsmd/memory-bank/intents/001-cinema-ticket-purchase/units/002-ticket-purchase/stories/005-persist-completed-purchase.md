---
id: 005-persist-completed-purchase
unit: 002-ticket-purchase
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 003-ticket-purchase
implemented: true
---

# Story: 005-persist-completed-purchase

## User Story

**As a** simulated cinema customer
**I want** my completed purchase persisted locally
**So that** its seats remain sold in later executions

## Acceptance Criteria

- [ ] **Given** a fully valid priced purchase, **When** completed, **Then** purchase data, sold seats, and next confirmation sequence are written together.
- [ ] **Given** a later execution using the same state path, **When** state is read, **Then** the purchase and sold seats remain present.
- [ ] **Given** a write failure, **When** persistence is attempted, **Then** failure is reported and the previous valid state remains intact.

## Technical Notes

Inject a state repository and implement replace-safe JSON writes through a temporary sibling file.

## Dependencies

### Requires
- 002-validate-seat-selection
- 004-apply-tuesday-discount

### Enables
- 006-receive-purchase-confirmation

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| State file does not exist | Initialize a valid empty state |
| State JSON is malformed | Reject without overwriting it |

## Out of Scope

- Multiple simultaneous writer processes.
