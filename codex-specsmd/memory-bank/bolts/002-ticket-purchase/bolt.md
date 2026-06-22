---
id: 002-ticket-purchase
unit: 002-ticket-purchase
intent: 001-cinema-ticket-purchase
type: simple-construction-bolt
status: complete
stories:
  - 001-submit-purchase-request
  - 002-validate-seat-selection
  - 003-calculate-format-pricing
  - 004-apply-tuesday-discount
created: 2026-06-19T20:34:24.000Z
started: 2026-06-19T20:57:33.000Z
completed: "2026-06-19T21:28:50Z"
current_stage: null
stages_completed:
  - name: plan
    completed: 2026-06-19T21:23:25.000Z
    artifact: implementation-plan.md
  - name: implement
    completed: 2026-06-19T21:25:48.000Z
    artifact: implementation-walkthrough.md
  - name: test
    completed: 2026-06-19T21:28:34.000Z
    artifact: test-walkthrough.md
requires_bolts:
  - 001-cinema-catalog
enables_bolts:
  - 003-ticket-purchase
requires_units:
  - 001-cinema-catalog
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 1
  max_dependencies: 2
  testing_scope: 2
---

# Bolt: 002-ticket-purchase

## Overview

Build pure purchase-request, seat-validation, format-pricing, and Tuesday-discount behavior.

## Objective

Produce a deterministic next purchase result without performing persistence or CLI rendering.

## Stories Included

- [ ] **001-submit-purchase-request**: Submit purchase request (Must)
- [ ] **002-validate-seat-selection**: Validate seat selection (Must)
- [ ] **003-calculate-format-pricing**: Calculate format pricing (Must)
- [ ] **004-apply-tuesday-discount**: Apply Tuesday discount (Must)

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. Plan**: Pending → `implementation-plan.md`
- [ ] **2. Implement**: Pending → source + `implementation-walkthrough.md`
- [ ] **3. Test**: Pending → tests + `test-walkthrough.md`

## Dependencies

### Requires
- `001-cinema-catalog`: Validated catalog, showtime, and seat concepts

### Enables
- `003-ticket-purchase`

## Expected Outputs

- Pure request validation and purchase domain types.
- Integer-minor-unit pricing and discount functions.
- Complete branch tests for pricing and Tuesday eligibility.

## Success Criteria

- [ ] Rejected selections never create a next state.
- [ ] All format and discount branches pass.
- [ ] Domain code imports neither Commander.js nor filesystem APIs.
- [ ] Build and tests pass.
