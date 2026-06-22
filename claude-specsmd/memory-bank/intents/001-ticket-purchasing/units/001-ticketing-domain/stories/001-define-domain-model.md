---
id: 001-define-domain-model
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 001-ticketing-domain
implemented: true
---

# Story: 001-define-domain-model

## User Story

**As a** developer building the cinema CLI
**I want** clear, pure domain types and a money representation
**So that** pricing, validation, discount, and confirmation logic share a consistent, testable foundation

## Acceptance Criteria

- [ ] **Given** the domain module, **When** I import it, **Then** types exist for Movie, Showtime, Seat, SeatStatus, Format (`2D`|`3D`|`IMAX`), Order, and Confirmation
- [ ] **Given** monetary values, **When** they are represented, **Then** they use integer cents (no floating-point currency math)
- [ ] **Given** the domain module, **When** it is inspected, **Then** it imports no Commander.js, no `console`, and no file-system APIs

## Technical Notes

- Place in `src/domain/` (e.g. `model.ts` / `types.ts`).
- Money as `number` cents or a small `Money` helper; format helper to render cents as `$X.XX` may live in the command layer.
- Keep types data-only; behavior goes in the rule modules.

## Dependencies

### Requires
- None (first story)

### Enables
- 002-validate-seat-selection, 003-calculate-format-price, 004-apply-tuesday-discount, 005-generate-confirmation

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Unknown format string | Type system / parser rejects; only 2D/3D/IMAX allowed |
| Negative cents | Not representable in valid orders; guarded by construction |

## Out of Scope

- Loading data from JSON (CLI unit)
- Rendering to console (CLI unit)
