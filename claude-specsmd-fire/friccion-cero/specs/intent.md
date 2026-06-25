# Intent — Fricción Cero

## Qué se quiere construir

Una aplicación fullstack que permita a **equipos o empresas** registrar **fricciones operativas**,
medir su impacto en **tiempo y dinero**, clasificarlas, priorizarlas y convertirlas en
**iniciativas de mejora**, con un **dashboard** que muestre el impacto agregado.

## Para quién

Equipos y empresas que quieren detectar y reducir ineficiencias operativas: trabajo manual
repetitivo, esperas/dependencias, duplicación de datos, reuniones sin decisión, aprobaciones
manuales, falta de integración, búsquedas excesivas, errores humanos, falta de trazabilidad.

## Qué problema resuelve

Las fricciones operativas consumen tiempo y dinero de forma invisible. Sin medirlas y priorizarlas,
no se sabe qué mejorar primero ni cuánto se ganaría al resolverlas. Fricción Cero las hace visibles,
cuantifica su costo y guía la priorización de mejoras.

## Alcance del MVP

Incluye:

1. **Gestión de fricciones**: CRUD completo.
2. **Cálculo automático de impacto** (horas y costo mensual) en el backend.
3. **Clasificación básica** por reglas de texto (sin IA externa).
4. **Priorización automática** (Baja/Media/Alta/Crítica).
5. **Iniciativas de mejora**: CRUD + conversión desde una fricción.
6. **Dashboard** con métricas agregadas.

No incluye (fuera del MVP): autenticación/usuarios, multi-tenant, IA externa, reportes avanzados,
integraciones con sistemas externos, despliegue en la nube.

## Decisión de stack

- Backend: **FastAPI + SQLModel + SQLite** (en lugar del .NET 8 sugerido inicialmente; cambio
  pedido por el usuario y consistente con el entorno disponible).
- Frontend: **Angular + PrimeNG** (según el requisito original).

## Criterios de éxito

- CRUD de fricciones e iniciativas funcionando contra la API real.
- Impacto y prioridad calculados automáticamente en el backend.
- Clasificación por reglas operativa.
- Dashboard con totales, distribución por categoría/prioridad, top 5 costosas e iniciativas por estado.
- Swagger habilitado; README con instrucciones de ejecución.
