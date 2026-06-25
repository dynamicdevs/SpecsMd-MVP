---
id: friction-screens
title: Friction Screens (List, Form, Detail)
intent: friccion-cero-mvp
complexity: medium
mode: confirm
status: pending
depends_on: [frontend-scaffold, friction-api]
created: "2026-06-23T12:00:00Z"
---

# Work Item: Friction Screens (List, Form, Detail)

## Description

Implementar las pantallas de fricciones: listado con tabla PrimeNG (filtrable, sortable), formulario de crear/editar con validación, y vista de detalle mostrando todos los campos incluyendo calculados.

## Acceptance Criteria

- [ ] FrictionService en Angular para llamadas HTTP al backend
- [ ] Listado de fricciones con PrimeNG Table (sortable, filterable por categoría/prioridad)
- [ ] Columnas visibles: Title, Category, MonthlyHoursLost, EstimatedMonthlyCost, Priority, Status
- [ ] Botón crear nueva fricción → navega al formulario
- [ ] Formulario con campos: Title, Description, Area, Category (dropdown), Frequency, TimeLostMinutes, PeopleAffected, PainLevel (slider/rating), AutomationPotential (dropdown)
- [ ] Validación en frontend (required, min values)
- [ ] Vista detalle muestra todos los campos + campos calculados + comentarios
- [ ] Acciones en detalle: Editar, Eliminar, Crear Iniciativa
- [ ] Toast notifications para éxito/error (PrimeNG Toast)

## Technical Notes

Category como PrimeNG Dropdown con las 9 categorías predefinidas. PainLevel como Rating (1-5). Frequency como input numérico (veces por mes).

## Dependencies

- frontend-scaffold
- friction-api
