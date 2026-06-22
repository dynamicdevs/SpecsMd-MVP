---
id: 005-generate-confirmation
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 001-ticketing-domain
implemented: false
---

# Story: 005-generate-confirmation

## User Story

**As a** buyer
**I want** to receive a complete confirmation after purchasing
**So that** I have proof of my ticket purchase with all relevant details

## Acceptance Criteria

- [ ] **Given** valid purchase data, **When** generateConfirmation is called, **Then** returns a Confirmation object
- [ ] **Given** a confirmation, **When** inspected, **Then** includes: customer name, movie title, showtime info, seat list, total amount, confirmation ID
- [ ] **Given** the same inputs twice, **When** generateConfirmation is called, **Then** produces the same confirmation ID (deterministic)
- [ ] **Given** different inputs, **When** generateConfirmation is called, **Then** produces different confirmation IDs

## Technical Notes

- Function signature: `generateConfirmation(data: PurchaseInput): Confirmation`
- Confirmation ID derived via SHA-256 hash of normalized input (customer + showtime + seats sorted)
- Use Node's built-in `crypto.createHash` (available in domain since it's a pure computation, no I/O)
- Truncate hash to first 8 hex chars for readability

## Dependencies

### Requires
- 001-define-domain-types (Confirmation, PurchaseInput types)

### Enables
- Used by buy command to display and persist the confirmation

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Same seats in different order | Same confirmation ID (sorted before hash) |
| Very long customer name | Works fine, no truncation |
