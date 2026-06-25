---
id: friccion-cero-mvp
title: Fricción Cero MVP
status: in_progress
created: "2026-06-23T12:00:00Z"
---

# Intent: Fricción Cero MVP

## Goal

Construir una plataforma fullstack funcional que permita a equipos, empresas o áreas internas detectar, registrar, medir y priorizar fricciones operativas que generan pérdida de tiempo, trabajo manual repetitivo, esperas, errores humanos, duplicación de datos o falta de trazabilidad. Cada fricción puede convertirse en una iniciativa de mejora con seguimiento.

## Users

- Empleados y líderes de área que detectan fricciones operativas en su día a día
- Gerentes que necesitan visibilidad del impacto económico de ineficiencias
- Equipos de mejora continua que priorizan iniciativas de optimización

## Problem

Las fricciones operativas (tareas manuales repetitivas, esperas, duplicación, errores) se acumulan silenciosamente en las organizaciones. No se miden, no se priorizan y no se convierten en acciones de mejora. El costo real de estas ineficiencias es invisible hasta que alguien lo cuantifica.

## Success Criteria

- Un usuario puede registrar una fricción con título, descripción, tiempo perdido, frecuencia, personas afectadas y nivel de molestia
- El sistema calcula automáticamente horas mensuales perdidas y costo mensual estimado
- El sistema clasifica automáticamente la categoría y potencial de automatización
- El sistema prioriza automáticamente las fricciones según impacto
- Dashboard muestra métricas generales y ranking de fricciones más costosas
- Una fricción puede convertirse en una iniciativa de mejora con seguimiento básico
- Frontend Angular con PrimeNG conectado a .NET 8 Web API
- Base de datos SQLite funcional con persistencia

## Constraints

- Stack obligatorio: Angular + PrimeNG (frontend), FastAPI + Python (backend), SQLite (DB)
- Sin autenticación en MVP (app interna)
- Sin APIs externas
- Arquitectura limpia y modular pero sin sobreingeniería
- Valor hora configurable (no hardcodeado)
- MVP funcional, no demo superficial — debe servir como base real para crecimiento

## Notes

Categorías de fricción predefinidas: Trabajo manual repetitivo, Espera o dependencia de terceros, Duplicación de datos, Reuniones innecesarias, Aprobaciones manuales, Falta de integración entre sistemas, Búsqueda excesiva de información, Errores humanos recurrentes, Falta de trazabilidad.

Entidades: Friction, Initiative, FrictionComment.

Reglas de cálculo:
- Horas mensuales = (minutos × frecuencia × personas) / 60
- Costo mensual = horas mensuales × valor hora configurable
- Prioridad alta si costo, horas o molestia son altos
- Automatización alta si categoría es repetitiva, duplicación, aprobaciones o falta de integración
