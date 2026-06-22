---
id: 004-cli-application
unit: 003-cli-application
intent: 001-cinema-ticket-purchase
type: simple-construction-bolt
status: complete
stories:
  - 001-use-scriptable-commands
  - 002-receive-stable-output-and-errors
created: 2026-06-19T20:34:24.000Z
started: 2026-06-19T21:40:28.000Z
completed: "2026-06-20T01:33:43Z"
current_stage: null
stages_completed:
  - name: plan
    completed: 2026-06-19T21:42:47.000Z
    artifact: implementation-plan.md
  - name: implement
    completed: 2026-06-19T21:45:30.000Z
    artifact: implementation-walkthrough.md
  - name: test
    completed: 2026-06-20T01:33:28.000Z
    artifact: test-walkthrough.md
requires_bolts:
  - 001-cinema-catalog
  - 003-ticket-purchase
enables_bolts: []
requires_units:
  - 001-cinema-catalog
  - 002-ticket-purchase
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 1
  max_dependencies: 2
  testing_scope: 2
---

# Bolt: 004-cli-application

## Overview

Integrate catalog and purchase use cases behind stable Commander.js commands and npm scripts.

## Objective

Deliver the complete scriptable CLI with deterministic output, typed error mapping, and cross-platform integration tests.

## Stories Included

- [ ] **001-use-scriptable-commands**: Use scriptable commands (Must)
- [ ] **002-receive-stable-output-and-errors**: Receive stable output and errors (Must)

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. Plan**: Pending → `implementation-plan.md`
- [ ] **2. Implement**: Pending → source + `implementation-walkthrough.md`
- [ ] **3. Test**: Pending → tests + `test-walkthrough.md`

## Dependencies

### Requires
- `001-cinema-catalog`: Catalog query behavior
- `003-ticket-purchase`: Complete persisted purchase behavior

### Enables
- Construction completion and cross-agent laboratory execution

## Expected Outputs

- Commander.js program and four public commands.
- Deterministic renderers and typed error-to-exit-code mapping.
- npm scripts and CLI integration tests using isolated files.

## Success Criteria

- [ ] All commands expose help and explicit scriptable options.
- [ ] stdout, stderr, and exit codes match requirements.
- [ ] Build and tests pass across supported operating systems.
- [ ] All intent acceptance criteria are covered.
