---
id: 001-ticketing-domain
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
type: simple-construction-bolt
status: complete
stories:
  - 001-define-domain-model
  - 002-validate-seat-selection
  - 003-calculate-format-price
  - 004-apply-tuesday-discount
  - 005-generate-confirmation
created: 2026-06-19T00:00:00.000Z
started: 2026-06-19T00:00:00.000Z
completed: "2026-06-19T18:44:43Z"
current_stage: null
stages_completed:
  - name: plan
    completed: 2026-06-19T00:00:00.000Z
    artifact: implementation-plan.md
requires_bolts: []
enables_bolts:
  - 002-ticketing-cli
  - 003-ticketing-cli
requires_units: []
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 1
  max_dependencies: 1
  testing_scope: 1
---

# Bolt: 001-ticketing-domain

## Overview

Builds and unit-tests the pure domain core for the cinema CLI: types, seat validation, format pricing, the Tuesday discount, and deterministic confirmation generation.

## Objective

Deliver a fully unit-tested `src/domain/` with no I/O or framework imports, providing the rules the CLI layer will orchestrate.

## Stories Included

- **001-define-domain-model**: Domain types & money (Must)
- **002-validate-seat-selection**: Reject unknown/sold seats, all-or-nothing (Must)
- **003-calculate-format-price**: 2D/3D/IMAX pricing (Must)
- **004-apply-tuesday-discount**: 20% Tuesday discount (Must)
- **005-generate-confirmation**: Deterministic confirmation (Must)

## Bolt Type

**Type**: simple-construction-bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. Plan**: Pending → implementation-plan.md
- [ ] **2. Implement**: Pending → src/domain/ + implementation-walkthrough.md
- [ ] **3. Test**: Pending → Vitest tests + test-walkthrough.md

## Dependencies

### Requires
- None (first bolt)

### Enables
- 002-ticketing-cli (read commands)
- 003-ticketing-cli (purchase flow)

## Success Criteria

- [ ] All 5 domain stories implemented
- [ ] Pricing, discount, validation, confirmation acceptance criteria met
- [ ] Vitest unit tests passing; no `any`; no I/O in domain
- [ ] Code reviewed

## Notes

This is the heart of the methodology comparison — small but real rules, ideal for unit testing across the three IDEs.
