---
id: 001-cinema-catalog
unit: 001-cinema-catalog
intent: 001-cinema-ticket-purchase
type: simple-construction-bolt
status: complete
stories:
  - 001-list-movie-catalog
  - 002-list-movie-showtimes
  - 003-view-seat-availability
created: 2026-06-19T20:34:24.000Z
started: 2026-06-19T20:42:09.000Z
completed: "2026-06-19T20:56:00Z"
current_stage: null
stages_completed:
  - name: plan
    completed: 2026-06-19T20:43:43.000Z
    artifact: implementation-plan.md
  - name: implement
    completed: 2026-06-19T20:49:18.000Z
    artifact: implementation-walkthrough.md
  - name: test
    completed: 2026-06-19T20:55:29.000Z
    artifact: test-walkthrough.md
requires_bolts: []
enables_bolts:
  - 002-ticket-purchase
  - 004-cli-application
requires_units: []
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 1
  max_dependencies: 1
  testing_scope: 2
---

# Bolt: 001-cinema-catalog

## Overview

Build the validated JSON catalog foundation and deterministic movie, showtime, and seat-availability queries.

## Objective

Complete every story in `001-cinema-catalog` behind presentation-neutral interfaces.

## Stories Included

- [ ] **001-list-movie-catalog**: List movie catalog (Must)
- [ ] **002-list-movie-showtimes**: List movie showtimes (Must)
- [ ] **003-view-seat-availability**: View seat availability (Must)

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. Plan**: Pending → `implementation-plan.md`
- [ ] **2. Implement**: Pending → source + `implementation-walkthrough.md`
- [ ] **3. Test**: Pending → tests + `test-walkthrough.md`

## Dependencies

### Requires
- None

### Enables
- `002-ticket-purchase`
- `004-cli-application`

## Expected Outputs

- Validated fixture types and JSON reader.
- Pure catalog and availability query services.
- Unit and adapter tests with deterministic fixtures.

## Success Criteria

- [ ] All stories and acceptance criteria pass.
- [ ] Invalid fixtures and identifiers are tested.
- [ ] Read operations do not mutate files.
- [ ] Build and tests pass.
