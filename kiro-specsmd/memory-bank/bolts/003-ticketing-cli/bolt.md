---
id: 003-ticketing-cli
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
type: simple-construction-bolt
status: complete
stories:
  - 005-buy-tickets
  - 006-cli-entry-and-scripts
created: 2026-06-21T00:00:00Z
started: 2026-06-21T14:10:00Z
completed: 2026-06-21T14:14:00Z
current_stage: null
stages_completed:
  - name: plan
    completed: 2026-06-21T14:10:00Z
    artifact: implementation-plan.md
  - name: implement
    completed: 2026-06-21T14:12:00Z
    artifact: implementation-walkthrough.md
  - name: test
    completed: 2026-06-21T14:14:00Z
    artifact: test-walkthrough.md
requires_bolts:
  - 001-ticketing-domain
  - 002-ticketing-cli
enables_bolts: []
requires_units:
  - 001-ticketing-domain
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 1
  max_dependencies: 3
  testing_scope: 2
---

# Bolt: 003-ticketing-cli

## Overview

Implements the purchase flow (`buy`) and wires the CLI entry point and npm scripts.

## Objective

Complete the end-to-end flow: validate → price → discount → confirmation, presented via the `buy` command, with a single Commander entry point and npm scripts for every command.

## Stories Included

- **005-buy-tickets**: `buy` command orchestrating the domain (Must)
- **006-cli-entry-and-scripts**: CLI entry point + npm scripts (Must)

## Bolt Type

**Type**: simple-construction-bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. Plan**: Pending → implementation-plan.md
- [ ] **2. Implement**: Pending → src/commands/buy, src/index.ts, package.json scripts + implementation-walkthrough.md
- [ ] **3. Test**: Pending → integration tests (happy + rejection paths) + test-walkthrough.md

## Dependencies

### Requires
- 001-ticketing-domain (validation, pricing, discount, confirmation)
- 002-ticketing-cli (data loaders + read commands)

### Enables
- None (final bolt; intent ready for Operations)

## Success Criteria

- [ ] `buy` succeeds for valid seats and prints a full confirmation
- [ ] `buy` rejects unknown/sold seats and missing args (all-or-nothing) with non-zero exit
- [ ] Tuesday discount reflected in totals
- [ ] npm scripts run all four commands; `npm test` runs Vitest
- [ ] Code reviewed

## Notes

Closes the flow end-to-end and makes the tool runnable from terminal.
