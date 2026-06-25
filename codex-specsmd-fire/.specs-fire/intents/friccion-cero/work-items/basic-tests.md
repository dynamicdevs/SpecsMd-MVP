---
id: basic-tests
title: Basic Tests
intent: friccion-cero
complexity: medium
mode: confirm
status: completed
depends_on:
  - dashboard-screen
created: 2026-06-24T15:46:27-04:00
run_id: run-codex-specsmd-fire-012
completed_at: 2026-06-25T17:11:23.344Z
---

# Work Item: Basic Tests

## Description

Add basic backend and frontend tests for calculation rules, API behavior, and critical UI flows.

## Acceptance Criteria

- [ ] Backend tests cover monthly hours lost calculation.
- [ ] Backend tests cover estimated monthly cost calculation.
- [ ] Backend tests cover priority and automation potential rules.
- [ ] Backend API smoke tests cover core friction and initiative endpoints where practical.
- [ ] Frontend tests or smoke checks cover key screens and service wiring.
- [ ] Test commands are documented.

## Technical Notes

Keep tests focused on high-value behavior. Avoid exhaustive UI testing for the MVP.

## Dependencies

- dashboard-screen
