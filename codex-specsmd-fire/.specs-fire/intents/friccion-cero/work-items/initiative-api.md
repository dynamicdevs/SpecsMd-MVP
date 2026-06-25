---
id: initiative-api
title: Initiative API
intent: friccion-cero
complexity: medium
mode: confirm
status: completed
depends_on:
  - friction-api
created: 2026-06-24T15:46:27-04:00
run_id: run-codex-specsmd-fire-006
completed_at: 2026-06-25T01:06:59.026Z
---

# Work Item: Initiative API

## Description

Implement initiative endpoints, including creating an initiative from a friction and tracking proposed solution, expected reduction, complexity, priority, and status.

## Acceptance Criteria

- [x] API supports creating an initiative from an existing friction.
- [x] API supports listing initiatives.
- [x] API supports retrieving initiative detail.
- [x] API supports updating initiative status and core fields.
- [x] API supports deleting an initiative if aligned with the backend conventions.
- [x] Initiative responses include enough friction context for frontend display.

## Technical Notes

Default initiative priority can inherit from the originating friction unless explicitly supplied.

## Dependencies

- friction-api
