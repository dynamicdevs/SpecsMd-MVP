---
id: frontend-scaffold
title: Scaffold Angular + PrimeNG
intent: friccion-cero
complexity: medium
mode: confirm
status: pending
depends_on: [backend-seed-swagger]
created: 2026-06-25
---

# Work Item: Scaffold Angular + PrimeNG

## Description

Crear el proyecto Angular, instalar y configurar PrimeNG, definir routing y los modelos/servicios
HTTP base que consumen la API real.

## Acceptance Criteria

- [ ] Proyecto Angular en frontend/friccion-cero-web.
- [ ] PrimeNG + PrimeIcons + PrimeFlex instalados y tema cargado.
- [ ] Routing con /dashboard, /frictions, /frictions/new, /frictions/:id, /frictions/:id/edit, /initiatives, /initiatives/:id.
- [ ] core/ con modelos (Friction, Initiative, enums) y servicios HTTP (FrictionService, InitiativeService, DashboardService).
- [ ] environment con apiUrl.

## Technical Notes

provideHttpClient. Servicios separados por feature.

## Dependencies

- backend-seed-swagger
