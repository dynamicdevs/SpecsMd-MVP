---
id: frontend-scaffold
title: Frontend Angular Scaffold
intent: friccion-cero-mvp
complexity: medium
mode: confirm
status: pending
depends_on: []
created: "2026-06-23T12:00:00Z"
---

# Work Item: Frontend Angular Scaffold

## Description

Crear proyecto Angular con PrimeNG configurado, routing base, layout con sidebar/topbar, y servicio HTTP base apuntando al backend. Verificar que el frontend corre y muestra el layout.

## Acceptance Criteria

- [ ] Proyecto Angular 18+ creado con Angular CLI (standalone)
- [ ] PrimeNG instalado y configurado (theme, icons, animations)
- [ ] Layout base con PrimeNG Sidebar + Toolbar + RouterOutlet
- [ ] Routing configurado: /frictions, /frictions/new, /frictions/:id, /initiatives, /initiatives/:id, /dashboard
- [ ] environment.ts con apiUrl apuntando a http://localhost:5000/api/v1
- [ ] HTTP interceptor base para manejo de errores
- [ ] Frontend compila y corre (ng serve) mostrando layout

## Technical Notes

Usar standalone components (Angular 18+). PrimeNG Sakai o tema Lara. Estructura: core/ (services), features/ (frictions, initiatives, dashboard), shared/ (models, components).

## Dependencies

(none) — puede ejecutarse en paralelo al backend
