# Plan: Backend Project Scaffold

## Work Item
- **ID**: backend-scaffold
- **Mode**: confirm
- **Intent**: friccion-cero-mvp

## Implementation Steps

1. Create `backend/` directory structure (app/, models/, schemas/, routers/, services/)
2. Create `requirements.txt` with pinned dependencies
3. Create `app/config.py` — pydantic-settings based config
4. Create `app/database.py` — SQLAlchemy engine + session
5. Create `app/main.py` — FastAPI app with CORS, router includes
6. Create `app/routers/health.py` — GET /api/health
7. Create `.env` and `.env.example`
8. Verify: uvicorn runs, /docs accessible, /api/health returns 200

## Decisions
- Sync SQLAlchemy (no async) — SQLite doesn't benefit from async, simpler code
- pydantic-settings for config — auto-loads .env, typed, validated
- No Alembic yet — added in domain-entities work item
- Single uvicorn process — sufficient for MVP development
