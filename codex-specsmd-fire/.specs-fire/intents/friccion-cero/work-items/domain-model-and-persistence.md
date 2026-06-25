---
id: domain-model-and-persistence
title: Domain Model and Persistence
intent: friccion-cero
complexity: medium
mode: confirm
status: completed
depends_on:
  - backend-solution-foundation
created: 2026-06-24T15:46:27-04:00
run_id: run-codex-specsmd-fire-003
completed_at: 2026-06-24T23:40:09.060Z
---

# Work Item: Domain Model and Persistence

## Description

Implement the initial Friction, Initiative, and FrictionComment domain model, DTOs, repository contracts, SQLite persistence, and initial migrations or schema setup.

## Acceptance Criteria

- [x] Friction entity includes the requested fields and timestamps.
- [x] Initiative entity includes the requested fields and links to Friction.
- [x] FrictionComment entity includes the requested fields and links to Friction.
- [x] DTOs exist for create, update, detail, and list use cases where useful.
- [x] SQLite persistence can create and read the initial schema.
- [x] Repository abstractions and implementations cover the MVP data access needs.

## Technical Notes

Prefer simple enum or string-backed value sets for status, priority, category, frequency, complexity, and automation potential.

## Dependencies

- backend-solution-foundation
