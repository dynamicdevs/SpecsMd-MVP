---
id: calculation-classification-services
title: Calculation and Classification Services
intent: friccion-cero
complexity: medium
mode: confirm
status: completed
depends_on:
  - domain-model-and-persistence
created: 2026-06-24T15:46:27-04:00
run_id: run-codex-specsmd-fire-004
completed_at: 2026-06-24T23:46:56.860Z
---

# Work Item: Calculation and Classification Services

## Description

Implement backend services for monthly lost hours, estimated monthly cost, friction category classification, automation potential, and priority suggestion.

## Acceptance Criteria

- [x] Monthly hours lost is calculated as minutes per event * monthly frequency * people affected / 60.
- [x] Estimated monthly cost is calculated from monthly hours lost and configurable hourly cost.
- [x] Classification rules assign the requested friction categories using simple practical heuristics.
- [x] Automation potential is high for repetitive work, duplicated data, manual approvals, and missing integrations.
- [x] Priority uses impact, pain level, and automation potential.
- [x] Calculation behavior is centralized and reused by APIs.

## Technical Notes

Keep rules explicit and easy to change. Do not introduce machine learning or complex rule engines for the MVP.

## Dependencies

- domain-model-and-persistence
