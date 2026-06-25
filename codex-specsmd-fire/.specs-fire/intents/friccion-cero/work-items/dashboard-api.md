---
id: dashboard-api
title: Dashboard API
intent: friccion-cero
complexity: medium
mode: confirm
status: completed
depends_on:
  - friction-api
  - initiative-api
created: 2026-06-24T15:46:27-04:00
run_id: run-codex-specsmd-fire-007
completed_at: 2026-06-25T01:18:59.937Z
---

# Work Item: Dashboard API

## Description

Implement backend endpoints that provide dashboard metrics, aggregate totals, and ranking of the most costly frictions.

## Acceptance Criteria

- [x] API returns total frictions, total monthly hours lost, total estimated monthly cost, and initiative counts.
- [x] API returns ranking of the most costly frictions.
- [x] API includes useful grouping by category, priority, or status where practical.
- [x] Dashboard data is calculated from persisted records.
- [x] Endpoint shape is documented in Swagger.

## Technical Notes

Use simple aggregate queries or in-memory aggregation after repository retrieval, whichever is simplest for the MVP size.

## Dependencies

- friction-api
- initiative-api
