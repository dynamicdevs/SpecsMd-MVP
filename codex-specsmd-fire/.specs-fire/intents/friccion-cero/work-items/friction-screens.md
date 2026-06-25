---
id: friction-screens
title: Friction Screens
intent: friccion-cero
complexity: medium
mode: confirm
status: completed
depends_on:
  - frontend-foundation
  - friction-api
created: 2026-06-24T15:46:27-04:00
run_id: run-codex-specsmd-fire-009
completed_at: 2026-06-25T02:18:22.339Z
---

# Work Item: Friction Screens

## Description

Implement the frontend screens for friction list, create/edit form, and friction detail, connected to the backend.

## Acceptance Criteria

- [x] Users can view a list of frictions.
- [x] Users can create a friction with the required inputs.
- [x] Users can edit an existing friction.
- [x] Users can view friction detail including calculated impact and priority.
- [x] Users can delete a friction with a clear confirmation.
- [x] Form validation prevents invalid required values.
- [x] UI uses PrimeNG components consistently.

## Technical Notes

Show derived fields as read-only outputs from the backend rather than recalculating separately in the frontend.

## Dependencies

- frontend-foundation
- friction-api
