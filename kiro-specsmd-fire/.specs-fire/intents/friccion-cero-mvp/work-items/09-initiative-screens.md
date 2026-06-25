---
id: initiative-screens
title: Initiative Screens (List, Detail)
intent: friccion-cero-mvp
complexity: low
mode: autopilot
status: pending
depends_on: [frontend-scaffold, initiative-api]
created: "2026-06-23T12:00:00Z"
---

# Work Item: Initiative Screens (List, Detail)

## Description

Implementar pantallas de iniciativas: listado general y detalle. La creación de iniciativa se hace desde el detalle de una fricción (ya cubierto en friction-screens).

## Acceptance Criteria

- [ ] InitiativeService en Angular para llamadas HTTP
- [ ] Listado de iniciativas con PrimeNG Table (Title, FrictionTitle, Status, Complexity, Priority)
- [ ] Vista detalle con todos los campos + link a la fricción origen
- [ ] Edición inline o formulario para actualizar estado/campos
- [ ] Filtro por status en el listado

## Technical Notes

Reutilizar patrones de friction-screens. Formulario de creación se invoca desde friction detail con FrictionId pre-poblado.

## Dependencies

- frontend-scaffold
- initiative-api
