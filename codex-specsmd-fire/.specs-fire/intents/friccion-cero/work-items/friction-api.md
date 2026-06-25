---
id: friction-api
title: Friction API
intent: friccion-cero
complexity: medium
mode: confirm
status: completed
depends_on:
  - calculation-classification-services
created: 2026-06-24T15:46:27-04:00
run_id: run-codex-specsmd-fire-005
completed_at: 2026-06-25T00:14:20.794Z
---

# Work Item: Friction API

## Description

Implement CRUD endpoints for frictions, including automatic calculations, classification, priority suggestion, comments support where practical, and detail/list responses for the frontend.

## Acceptance Criteria

- [x] API supports creating a friction.
- [x] API supports listing frictions with calculated fields.
- [x] API supports retrieving friction detail.
- [x] API supports updating a friction and recalculating derived fields.
- [x] API supports deleting a friction.
- [x] API supports basic comments for a friction if included in the MVP backend shape.
- [x] Validation errors return useful responses.

## Technical Notes

Keep endpoint design REST-like and simple: `/api/frictions` and nested comment routes if needed.

## Dependencies

- calculation-classification-services
