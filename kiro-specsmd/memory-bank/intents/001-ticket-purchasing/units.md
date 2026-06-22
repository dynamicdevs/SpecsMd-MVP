---
intent: 001-ticket-purchasing
phase: inception
updated: 2026-06-21T00:00:00Z
---

# Units: Ticket Purchasing

## Decomposition Strategy

**Project type**: cli-tool
**Decomposition**: command-based + domain separation

El intent se descompone en 2 units:
1. **Domain core** — lógica de negocio pura (sin I/O)
2. **CLI layer** — comandos Commander.js + data loaders + persistencia

## Requirement-to-Unit Mapping

| FR | Requirement | Unit |
|----|-------------|------|
| FR-1 | Listar cartelera | 002-ticketing-cli |
| FR-2 | Consultar funciones | 002-ticketing-cli |
| FR-3 | Ver disponibilidad de asientos | 002-ticketing-cli |
| FR-4 | Validar selección de asientos | 001-ticketing-domain |
| FR-5 | Calcular precio por formato | 001-ticketing-domain |
| FR-6 | Aplicar descuento de martes | 001-ticketing-domain |
| FR-7 | Generar confirmación | 001-ticketing-domain |
| FR-8 | Persistir compras | 002-ticketing-cli |
| FR-9 | Comando buy (flujo completo) | 002-ticketing-cli |

## Units

### 001-ticketing-domain
- **Purpose**: Pure domain logic — validation, pricing, discount, confirmation
- **Stories**: 5
- **Bolts**: 1
- **Dependencies**: None

### 002-ticketing-cli
- **Purpose**: CLI commands, data loading, persistence, user interaction
- **Stories**: 6
- **Bolts**: 2
- **Dependencies**: 001-ticketing-domain

## Dependency Graph

```text
001-ticketing-domain ──► 002-ticketing-cli
```
