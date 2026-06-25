---
id: backend-scaffold
title: Backend Project Scaffold
intent: friccion-cero-mvp
complexity: medium
mode: confirm
status: pending
depends_on: []
created: "2026-06-23T12:00:00Z"
---

# Work Item: Backend Project Scaffold

## Description

Crear la estructura del proyecto FastAPI con la organización modular (routers, services, models, schemas). Configurar SQLAlchemy + SQLite, CORS, y verificar que el backend corre con un health endpoint.

## Acceptance Criteria

- [ ] Carpeta backend/ con estructura: app/ (main, config, database, models/, schemas/, routers/, services/)
- [ ] FastAPI app configurado con CORS (localhost:4200)
- [ ] SQLAlchemy configurado con SQLite (archivo local)
- [ ] Config via pydantic-settings (.env para HOURLY_RATE, DATABASE_URL)
- [ ] Health check endpoint GET /api/health retorna 200
- [ ] requirements.txt con dependencias pinned
- [ ] Swagger UI accesible en /docs (automático con FastAPI)
- [ ] Server corre con uvicorn sin errores

## Technical Notes

Estructura plana: app/main.py como entry point. pydantic-settings para config desde .env. SQLAlchemy 2.0 con mapped_column. HOURLY_RATE default 25.0.

## Dependencies

(none)
