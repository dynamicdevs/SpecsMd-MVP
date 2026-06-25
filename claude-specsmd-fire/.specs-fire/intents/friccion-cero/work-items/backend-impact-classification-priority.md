---
id: backend-impact-classification-priority
title: "Servicios: impacto, clasificación, priorización"
intent: friccion-cero
complexity: medium
mode: confirm
status: pending
depends_on: [backend-domain-model]
created: 2026-06-25
---

# Work Item: Servicios de impacto, clasificación y priorización

## Description

Implementar la lógica de negocio pura: cálculo de impacto, clasificación por reglas de texto y
priorización automática. Es el corazón del producto y debe ser testeable.

## Acceptance Criteria

- [ ] `impact_service`: MonthlyHoursLost = TimeLostMinutes * Frequency * PeopleAffected / 60; EstimatedMonthlyCost = MonthlyHoursLost * HourlyRate.
- [ ] `classification_service`: sugiere Category según palabras clave (copiar/excel/manual → Trabajo manual repetitivo; esperar/aprobación/correo → Aprobaciones manuales; reunión → Reuniones innecesarias; buscar/información/documento → Búsqueda excesiva de información; sistema/integración/doble ingreso → Falta de integración).
- [ ] `prioritization_service`: determina Priority (Crítica/Alta/Media/Baja) según horas, costo, PainLevel, AutomationPotential.
- [ ] Tests unitarios de las tres reglas principales (pytest).

## Technical Notes

HourlyRate viene de config. Clasificación case-insensitive e insensible a acentos.

## Dependencies

- backend-domain-model
