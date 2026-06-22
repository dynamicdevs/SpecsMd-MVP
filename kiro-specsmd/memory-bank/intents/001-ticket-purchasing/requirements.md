---
intent: 001-ticket-purchasing
phase: inception
status: complete
created: 2026-06-21T00:00:00Z
updated: 2026-06-21T00:00:00Z
---

# Requirements: Ticket Purchasing

## Intent Overview

CLI tool for cinema ticket purchasing: browse movies, check showtimes, select seats, calculate prices with format-based pricing and Tuesday discounts, and generate purchase confirmations with local JSON persistence.

## Business Goals

| Goal | Success Metric | Priority |
|------|----------------|----------|
| Full purchase flow via terminal | All commands execute correctly end-to-end | Must |
| Deterministic behavior | Same input → same output always | Must |
| Cross-agent comparability | Simple, clear design easy to compare across Kiro/Codex/Claude | Must |

---

## Functional Requirements

### FR-1: Listar cartelera
- **Description**: El comprador ejecuta un comando para ver todas las películas disponibles
- **Acceptance Criteria**:
  - Se muestran todas las películas del JSON mock con título y formato(s)
  - Si no hay películas, se muestra mensaje informativo
- **Priority**: Must

### FR-2: Consultar funciones por película
- **Description**: El comprador consulta las funciones (showtimes) disponibles para una película específica
- **Acceptance Criteria**:
  - Se filtran funciones por ID de película
  - Se muestra fecha, hora y formato (2D/3D/IMAX) de cada función
  - Si la película no existe, se muestra error claro con exit code 1
- **Priority**: Must

### FR-3: Ver disponibilidad de asientos
- **Description**: El comprador ve los asientos disponibles y ocupados para una función
- **Acceptance Criteria**:
  - Se muestra lista de asientos con estado (libre/ocupado)
  - Se identifica la función por ID
  - Si la función no existe, se muestra error claro con exit code 1
- **Priority**: Must

### FR-4: Validar selección de asientos
- **Description**: El sistema valida que los asientos seleccionados sean válidos y estén libres
- **Acceptance Criteria**:
  - Rechaza asientos que no existen en la sala
  - Rechaza asientos ya ocupados
  - Validación todo-o-nada: si un asiento falla, se rechaza toda la selección
- **Priority**: Must

### FR-5: Calcular precio por formato
- **Description**: El sistema calcula el precio total basado en formato de pantalla
- **Acceptance Criteria**:
  - 2D: precio base (ej. $50)
  - 3D: precio base + recargo (ej. $70)
  - IMAX: precio base + recargo mayor (ej. $120)
  - Precio total = precio unitario × cantidad de asientos
- **Priority**: Must

### FR-6: Aplicar descuento de martes
- **Description**: Si la función es un martes, se aplica 20% de descuento al total
- **Acceptance Criteria**:
  - El descuento se determina por la fecha de la función, no por el día de ejecución
  - El cálculo es determinístico (misma entrada → misma salida)
  - Se muestra subtotal, descuento y total final
- **Priority**: Must

### FR-7: Generar confirmación de compra
- **Description**: Al completar una compra válida, se genera una confirmación con todos los detalles
- **Acceptance Criteria**:
  - Incluye: nombre del cliente, película, función, asientos, total, ID de confirmación
  - El ID de confirmación es determinístico (derivado de los datos de entrada)
  - Se imprime en consola de forma legible
- **Priority**: Must

### FR-8: Persistir compras localmente
- **Description**: Las compras confirmadas se guardan en un archivo JSON local
- **Acceptance Criteria**:
  - Las compras persisten entre ejecuciones del CLI
  - Los asientos comprados se marcan como ocupados para futuras consultas
  - El archivo de persistencia es un JSON legible
- **Priority**: Must

### FR-9: Comando buy (flujo completo)
- **Description**: Comando que orquesta: validar → precio → descuento → confirmación → persistir
- **Acceptance Criteria**:
  - Acepta: función, nombre del cliente y asientos como parámetros
  - Compra válida: imprime confirmación y exit code 0
  - Compra inválida: imprime error descriptivo y exit code 1
- **Priority**: Must

---

## Non-Functional Requirements

### NFR-1: Offline y sin dependencias externas
- Sin APIs, sin base de datos, sin autenticación
- Datos 100% mock locales (JSON)

### NFR-2: Determinismo
- Misma entrada → misma salida siempre
- Sin dependencia de fecha/hora actual para lógica de dominio

### NFR-3: Cross-platform
- Compatible con Windows, macOS y Linux
- Sin paths hardcodeados ni dependencias de OS

### NFR-4: Testabilidad
- Tests usan fixtures aisladas o reseteables
- La persistencia JSON no contamina entre tests
- Domain layer puro: sin I/O, sin side effects

### NFR-5: Simplicidad arquitectónica
- Dominio puro separado de CLI (Commander.js)
- CLI solo parsea, llama dominio, muestra output
- No sobreingenierizar: sin abstracciones innecesarias

---

## Constraints

### Technical Constraints

**Intent-specific constraints**:
- Datos mock en JSON estático (no generados en runtime)
- Persistencia en archivo JSON local (no DB)
- Sin network I/O ni APIs externas
- Domain layer 100% puro (sin I/O, sin console, sin fs)

### Business Constraints
- Alcance mínimo para comparabilidad entre agentes AI
- Sin deadline, pero el scope debe mantenerse pequeño

---

## Assumptions

| Assumption | Risk if Invalid | Mitigation |
|------------|-----------------|------------|
| JSON mock es suficiente para simular el dominio | Limitaciones en edge cases complejos | Mantener datos mock realistas |
| Un solo archivo de persistencia basta | Conflictos si hay acceso concurrente | CLI es single-user, no hay concurrencia |
| Los precios son en centavos (int) | Errores de punto flotante | Usar enteros para money |

---

## Open Questions

| Question | Resolution |
|----------|------------|
| ¿Moneda? | Pesos mexicanos (MXN), representados en centavos | Resolved |
| ¿Máximo de asientos por compra? | Sin límite artificial, se validan contra disponibilidad | Resolved |
