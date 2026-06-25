---
id: calculation-services
title: Calculation & Classification Services
intent: friccion-cero-mvp
complexity: medium
mode: confirm
status: pending
depends_on: [domain-entities]
created: "2026-06-23T12:00:00Z"
---

# Work Item: Calculation & Classification Services

## Description

Implementar los servicios de cálculo (horas mensuales, costo mensual), clasificación (potencial de automatización) y priorización automática. Funciones puras sin dependencia de DB.

## Acceptance Criteria

- [ ] calculation.py: calculate_monthly_hours_lost(time_minutes, frequency, people) → float
- [ ] calculation.py: calculate_estimated_monthly_cost(monthly_hours, hourly_rate) → float
- [ ] classification.py: determine_automation_potential(category) → AutomationPotential enum
- [ ] Automatización alta si categoría es: trabajo repetitivo, duplicación, aprobaciones manuales, falta de integración
- [ ] priority.py: calculate_priority(monthly_cost, monthly_hours, pain_level) → Priority enum
- [ ] Prioridad alta si costo > umbral O horas > umbral O pain_level >= 4
- [ ] Umbrales leídos desde config (Settings)

## Technical Notes

Servicios son funciones puras (no clases). Reciben datos y retornan cálculos. Hourly rate default: 25.0. Umbrales default: costo > 500/mes, horas > 20/mes para prioridad alta.

## Dependencies

- domain-entities
