# Checkpoints FIRE — Fricción Cero

Puntos de control para validar avance antes de seguir construyendo. En FIRE los checkpoints son
adaptativos (0–2 según complejidad); aquí se consolidan los hitos de validación del MVP.

## CP-1 — Lógica de negocio (núcleo del producto) ✅

**Valida**: las fórmulas y reglas son correctas antes de exponerlas por API.

- [x] `MonthlyHoursLost = TimeLostMinutes * Frequency * PeopleAffected / 60`
- [x] `EstimatedMonthlyCost = MonthlyHoursLost * HourlyRate`
- [x] Clasificación por reglas (excel→manual, aprobación→aprobaciones, reunión, búsqueda, integración)
- [x] Priorización (Crítica/Alta/Media/Baja)

**Evidencia**: `pytest` → 12 tests en verde (`backend/tests/test_business_logic.py`).

## CP-2 — API funcional ✅

**Valida**: el backend expone el CRUD completo y el dashboard, con cálculos automáticos.

- [x] CRUD de fricciones con recálculo de impacto/prioridad y sugerencia de categoría
- [x] CRUD de iniciativas + crear desde fricción (hereda prioridad)
- [x] Dashboard agregado
- [x] Manejo de 404, Swagger en `/docs`, CORS

**Evidencia**: smoke test vía TestClient (crear fricción → impacto/categoría/prioridad calculados;
iniciativa desde fricción; dashboard con totales; 404; classify) + ejecución real de `uvicorn`
respondiendo en `http://localhost:8000` con seed de 5 fricciones.

## CP-3 — Frontend integrado ✅

**Valida**: la SPA consume la API real (sin mocks) y compila.

- [x] Servicios HTTP por feature apuntando a `environment.apiUrl`
- [x] Pantallas de fricciones, iniciativas y dashboard
- [x] Formularios reactivos + componentes PrimeNG

**Evidencia**: `ng build` completa sin errores (7 componentes lazy compilados).

## CP-4 — Documentación y ejecución ✅

- [x] README con instrucciones de backend y frontend
- [x] Documentos `/specs` (intent, work-items, checkpoints, architecture)
- [x] Decisión de cambio de stack documentada
