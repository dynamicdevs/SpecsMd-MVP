---
id: backend-scaffold
title: Scaffold FastAPI + SQLModel + SQLite
intent: friccion-cero
complexity: medium
mode: confirm
status: pending
depends_on: []
created: 2026-06-25
---

# Work Item: Scaffold FastAPI + SQLModel + SQLite

## Description

Crear la estructura base del backend FastAPI con SQLModel y SQLite, organizada en capas
(core/config, core/database, models, schemas, repositories, services, api). Configurar
`requirements.txt`, app FastAPI con CORS y Swagger, y arranque de la DB.

## Acceptance Criteria

- [ ] Estructura de carpetas `backend/app/{core,models,schemas,repositories,services,api}`.
- [ ] `requirements.txt` con fastapi, uvicorn, sqlmodel, pydantic.
- [ ] `app/core/config.py` con `HourlyRate` por defecto configurable por env.
- [ ] `app/core/database.py` con engine SQLite + `get_session` + `create_db_and_tables`.
- [ ] `app/main.py` levanta FastAPI con CORS y crea tablas al iniciar.
- [ ] Swagger disponible en `/docs`.

## Technical Notes

SQLite file `friccion_cero.db`. Migraciones por `SQLModel.metadata.create_all` en startup.

## Dependencies

(none)
