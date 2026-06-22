---
id: 002-ticketing-cli
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
type: simple-construction-bolt
status: complete
stories:
  - 001-load-mock-data
  - 002-view-billboard
  - 003-list-showtimes
  - 004-view-seats
created: 2026-06-19T00:00:00.000Z
started: 2026-06-19T18:45:00.000Z
completed: "2026-06-19T18:51:14Z"
current_stage: null
stages_completed:
  - name: plan
    completed: 2026-06-19T18:45:00.000Z
    artifact: implementation-plan.md
requires_bolts:
  - 001-ticketing-domain
enables_bolts:
  - 003-ticketing-cli
requires_units:
  - 001-ticketing-domain
blocks: false
complexity:
  avg_complexity: 1
  avg_uncertainty: 1
  max_dependencies: 2
  testing_scope: 2
---

# Bolt: 002-ticketing-cli

## Overview

Loads mock JSON data and delivers the read-only CLI commands: `billboard`, `showtimes`, and `seats`.

## Objective

Stand up the data layer and the three browsing commands so a user can explore movies, showtimes, and seat availability before purchasing.

## Stories Included

- **001-load-mock-data**: JSON loaders for movies/showtimes/seats (Must)
- **002-view-billboard**: `billboard` command (Must)
- **003-list-showtimes**: `showtimes --movie` command (Must)
- **004-view-seats**: `seats --showtime` command (Must)

## Bolt Type

**Type**: simple-construction-bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. Plan**: Pending → implementation-plan.md
- [ ] **2. Implement**: Pending → src/data/, src/commands/ + implementation-walkthrough.md
- [ ] **3. Test**: Pending → integration tests + test-walkthrough.md

## Dependencies

### Requires
- 001-ticketing-domain (domain types)

### Enables
- 003-ticketing-cli (purchase flow needs the data loaders)

## Success Criteria

- [ ] Mock JSON loads into typed dataset; loader errors are clear
- [ ] `billboard`, `showtimes`, `seats` work and error on unknown IDs / missing args
- [ ] Integration tests passing against fixture JSON
- [ ] Code reviewed

## Notes

Read commands are isolated from the domain-dependent purchase flow so they can land independently.
