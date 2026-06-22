---
id: 003-calculate-format-price
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 001-ticketing-domain
implemented: false
---

# Story: 003-calculate-format-price

## User Story

**As a** buyer
**I want** to see the correct price based on the screen format
**So that** I know exactly how much I'll pay before confirming

## Acceptance Criteria

- [ ] **Given** format "2D" and 1 seat, **When** calculatePrice is called, **Then** returns 5000 (centavos)
- [ ] **Given** format "3D" and 1 seat, **When** calculatePrice is called, **Then** returns 7000 (centavos)
- [ ] **Given** format "IMAX" and 1 seat, **When** calculatePrice is called, **Then** returns 12000 (centavos)
- [ ] **Given** format "3D" and 3 seats, **When** calculatePrice is called, **Then** returns 21000 (7000 × 3)
- [ ] **Given** an unknown format, **When** calculatePrice is called, **Then** throws an error

## Technical Notes

- Function signature: `calculatePrice(format: ScreenFormat, seatCount: number): number`
- Returns centavos (integer)
- Price constants should be exported for testability

## Dependencies

### Requires
- 001-define-domain-types (ScreenFormat type)

### Enables
- Used by buy flow (before discount)
