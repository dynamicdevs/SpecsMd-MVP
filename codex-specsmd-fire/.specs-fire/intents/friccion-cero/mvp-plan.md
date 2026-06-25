---
intent: friccion-cero
title: Friccion Cero MVP Plan
created: 2026-06-24T20:14:00Z
status: ready_for_execution
---

# Friccion Cero MVP Plan

## Objective

Build a functional fullstack MVP that lets teams register operational frictions, quantify their monthly time and cost impact, prioritize them, and convert them into trackable improvement initiatives.

## MVP Scope

The MVP includes:

- CRUD for frictions.
- Automatic monthly hours lost calculation.
- Automatic estimated monthly cost calculation.
- Basic rule-based classification.
- Automatic priority suggestion using impact, pain level, and automation potential.
- Dashboard with general metrics.
- Ranking of the most costly frictions.
- Initiative creation from a friction.
- Basic initiative tracking.
- Angular frontend connected to the Node.js/Express backend.
- Basic tests and execution documentation.

## Out of Scope for MVP

- Authentication and authorization.
- Multi-tenant organization management.
- Advanced workflow approvals.
- Notifications.
- Machine learning classification.
- Complex custom reporting.
- External system integrations.

## Architecture Direction

Use a pragmatic clean modular architecture:

```text
friccion-cero/
  backend/
    src/
      controllers/
      dtos/
      entities/
      repositories/
      services/
      persistence/
      app.ts
      server.ts
    prisma/
      schema.prisma
  frontend/
    src/app/
      core/
      features/
      shared/
```

This keeps responsibilities separated without adding extra packages or layers before the MVP needs them.

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend framework | Node.js, TypeScript, Express | Aligns backend language with Angular/TypeScript and stays lightweight for the MVP. |
| Frontend framework | Angular with PrimeNG | Required stack, component library accelerates CRUD/dashboard UI. |
| Initial database | SQLite | Required stack, low-friction local persistence for MVP. |
| API style | REST-like JSON endpoints | Simple for Angular integration and Swagger inspection. |
| Data access | Repository layer over Prisma + SQLite | Keeps controllers/services decoupled from persistence while providing typed SQLite access. |
| Rule logic | Explicit service classes | Easy to test, explain, and change without adding a rule engine. |
| Auth | Omitted for MVP | Avoids delaying operational value; can be added after core workflows stabilize. |

## Implementation Sequence

1. Backend solution foundation.
2. Domain model and SQLite persistence.
3. Calculation and classification services.
4. Friction API.
5. Initiative API.
6. Dashboard API.
7. Angular/PrimeNG frontend foundation.
8. Friction list, form, and detail screens.
9. Initiative list, detail, and create-from-friction flow.
10. Dashboard screen.
11. Basic tests.
12. Execution documentation.

## Checkpoints

| Phase | Work Item | Mode | Checkpoint |
|-------|-----------|------|------------|
| Planning | plan-mvp-checkpoints | autopilot | No pause; this plan is generated directly. |
| Backend foundation | backend-solution-foundation | confirm | Present backend structure and commands before scaffolding. |
| Data model | domain-model-and-persistence | confirm | Present entity/DTO/repository plan before implementation. |
| Rules | calculation-classification-services | confirm | Present formulas, thresholds, and category rules before implementation. |
| Friction API | friction-api | confirm | Present endpoint contract before implementation. |
| Initiative API | initiative-api | confirm | Present endpoint contract before implementation. |
| Dashboard API | dashboard-api | confirm | Present aggregate response shape before implementation. |
| Frontend foundation | frontend-foundation | confirm | Present Angular structure and PrimeNG setup before implementation. |
| Friction screens | friction-screens | confirm | Present screen/form behavior before implementation. |
| Initiative screens | initiative-screens | confirm | Present initiative UI flow before implementation. |
| Dashboard screen | dashboard-screen | confirm | Present metric cards/ranking layout before implementation. |
| Tests | basic-tests | confirm | Present test focus before adding tests. |
| Docs | execution-documentation | autopilot | No pause; document final commands and decisions. |

## Calculation Rules

Monthly hours lost:

```text
time_lost_minutes * monthly_frequency * people_affected / 60
```

Estimated monthly cost:

```text
monthly_hours_lost * configurable_hourly_cost
```

Default hourly cost should live in backend configuration and be easy to change.

## Classification Rules

Use simple keyword and field-based rules for the MVP:

| Category | Rule Hints |
|----------|------------|
| Trabajo manual repetitivo | repetitive, manual, copy/paste, recurring task. |
| Espera o dependencia de terceros | waiting, blocked, dependency, third party. |
| Duplicacion de datos | duplicate entry, repeated data, multiple systems. |
| Reuniones innecesarias | meeting, recurring sync, unnecessary call. |
| Aprobaciones manuales | approval, authorization, signature, manual validation. |
| Falta de integracion entre sistemas | no integration, disconnected systems, export/import. |
| Busqueda excesiva de informacion | searching, lookup, finding files, missing source. |
| Errores humanos recurrentes | mistakes, manual errors, rework, corrections. |
| Falta de trazabilidad | no status, no audit trail, cannot track. |

If no rule matches, use a practical fallback such as `Trabajo manual repetitivo` only when the description suggests manual effort; otherwise keep the category as an explicit `Unclassified` or require user selection.

## Priority Rules

Use a simple score:

- Monthly hours lost contributes the largest weight.
- Estimated monthly cost contributes a large weight.
- Pain level contributes a large weight.
- Automation potential adds a boost.

Suggested thresholds can start simple:

- High priority when monthly cost, monthly hours lost, or pain level is high.
- Medium priority for moderate impact or pain.
- Low priority for small impact and low pain.

The exact thresholds should be centralized in one service and covered by tests.

## Automation Potential Rules

Set high automation potential when the category is one of:

- Trabajo manual repetitivo.
- Duplicacion de datos.
- Aprobaciones manuales.
- Falta de integracion entre sistemas.

Use medium for information search, recurring errors, and traceability problems. Use low for meetings or third-party waiting unless the friction description clearly suggests automation.

## API Surface Draft

```text
GET    /api/frictions
POST   /api/frictions
GET    /api/frictions/{id}
PUT    /api/frictions/{id}
DELETE /api/frictions/{id}

GET    /api/initiatives
POST   /api/frictions/{frictionId}/initiatives
GET    /api/initiatives/{id}
PUT    /api/initiatives/{id}
DELETE /api/initiatives/{id}

GET    /api/dashboard
```

## Frontend Screens

- Dashboard general.
- Friction list.
- Friction create/edit form.
- Friction detail.
- Initiative list.
- Initiative detail/edit.

Prefer dense, operational UI patterns: tables, forms, metric cards, tags, filters, and clear action buttons.

## Verification Strategy

- Backend unit tests for calculation, priority, and classification services.
- Backend API smoke tests for friction and initiative endpoints if the chosen project template makes this practical.
- Frontend smoke checks for routing, service wiring, and main screens.
- Manual verification through Swagger and Angular UI before documentation is finalized.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| MVP grows too broad | Keep auth, advanced reporting, and integrations out of scope. |
| Rule thresholds become subjective | Centralize thresholds and document assumptions. |
| Frontend/backend contracts drift | Define DTOs clearly and verify through API services. |
| Clean architecture becomes overengineered | Keep one backend project unless separate projects become clearly valuable. |

## Ready Criteria for Implementation

- Intent brief exists.
- Work items exist and are dependency ordered.
- This MVP plan exists and defines checkpoints.
- Builder can start with `backend-solution-foundation`.
