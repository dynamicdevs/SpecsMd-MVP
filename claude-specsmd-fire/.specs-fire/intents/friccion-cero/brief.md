---
id: friccion-cero
title: Fricción Cero MVP
status: in_progress
created: 2026-06-25
---

# Intent: Fricción Cero MVP

## Goal

Construir una aplicación fullstack que permita a equipos o empresas **registrar fricciones
operativas**, **medir cuánto tiempo y dinero hacen perder**, **clasificarlas**, **priorizarlas**
y **convertirlas en iniciativas de mejora**, con un dashboard que muestre el impacto agregado.

## Users

Equipos y empresas que quieren detectar y reducir ineficiencias operativas (trabajo manual
repetitivo, esperas, duplicación de datos, reuniones sin decisión, errores recurrentes, falta
de integración, etc.).

## Problem

Las fricciones operativas (copiar datos entre sistemas, esperar aprobaciones por correo, revisar
documentos repetitivos, buscar información dispersa, reuniones sin decisión, errores humanos,
falta de integración/trazabilidad) consumen tiempo y dinero de forma invisible. Sin medirlas y
priorizarlas, no se sabe qué mejorar primero ni cuánto se ganaría al resolverlas.

## Success Criteria

- CRUD completo de **fricciones** (crear, listar, ver detalle, editar, eliminar).
- CRUD de **iniciativas** y conversión **fricción → iniciativa**.
- **Cálculo automático de impacto** en backend:
  - `MonthlyHoursLost = TimeLostMinutes * Frequency * PeopleAffected / 60`
  - `EstimatedMonthlyCost = MonthlyHoursLost * HourlyRate` (valor hora configurable).
- **Clasificación por reglas** de texto (sin IA externa).
- **Priorización automática** (Baja/Media/Alta/Crítica) según horas, costo, PainLevel y AutomationPotential.
- **Dashboard** con totales, distribución por categoría/prioridad, top 5 más costosas e iniciativas por estado.
- Frontend Angular + PrimeNG que consume la **API real** (sin mocks como fuente final).
- Swagger habilitado; README con instrucciones de ejecución de backend y frontend.

## Constraints

- Stack: **FastAPI + SQLModel + SQLite** (backend) y **Angular + PrimeNG** (frontend).
  (Cambio respecto al .NET 8 originalmente sugerido, por decisión del usuario.)
- No usar IA externa para clasificar — solo reglas simples.
- No demos falsas ni datos mock como fuente principal.
- No sobreingenierizar; mantener el código limpio, simple y extensible.
- Cada feature debe quedar funcionando antes de pasar a la siguiente.

## Notes

Estructura monorepo:
```
friccion-cero/
  backend/                  # FastAPI + SQLModel + SQLite
  frontend/friccion-cero-web/  # Angular + PrimeNG
```
Las 4 capas pedidas para .NET (Controllers/Services/Repositories/DTOs+Entities) se mapean a
`api/` (routers) · `services/` · `repositories/` · `schemas/` + `models/`.

**Bloqueo de entorno conocido**: el .NET SDK no está instalado en la máquina (por eso, entre otras
razones, se cambió el stack). Python 3.12 y Node están disponibles.
