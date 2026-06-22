---
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
phase: inception
status: ready
created: 2026-06-21T00:00:00Z
updated: 2026-06-21T00:00:00Z
unit_type: cli
default_bolt_type: simple-construction-bolt
---

# Unit Brief: Ticketing CLI

## Purpose

CLI layer using Commander.js: loads mock data from JSON, exposes browsing commands (billboard, showtimes, seats), orchestrates the purchase flow (buy command), and persists purchases to a local JSON file.

## Scope

### In Scope
- Mock data loading from JSON files (movies, showtimes, seats)
- `billboard` command — list all movies
- `showtimes` command — list showtimes for a movie
- `seats` command — show seat availability for a showtime
- `buy` command — orchestrate purchase flow (validate → price → discount → confirm → persist)
- JSON persistence of purchases (write confirmed purchases, update seat status)
- CLI entry point (Commander.js program setup)
- npm scripts for all commands

### Out of Scope
- Business logic (delegated to 001-ticketing-domain)
- Interactive prompts (all via command arguments)
- Network I/O

---

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Listar cartelera | Must |
| FR-2 | Consultar funciones por película | Must |
| FR-3 | Ver disponibilidad de asientos | Must |
| FR-8 | Persistir compras localmente | Must |
| FR-9 | Comando buy (flujo completo) | Must |

---

## Domain Concepts

### Key Entities
| Entity | Description | Attributes |
|--------|-------------|------------|
| DataStore | In-memory loaded mock data | movies[], showtimes[], seats[] |
| PurchaseStore | Persisted purchases | purchases[], file path |

### Key Operations
| Operation | Description | Inputs | Outputs |
|-----------|-------------|--------|---------|
| loadMockData | Lee JSON fixtures a memoria | file paths | DataStore |
| savePurchase | Persiste compra y actualiza asientos | Purchase, path | void (writes file) |
| billboard | Lista películas | DataStore | console output |
| showtimes | Filtra funciones por movie | movieId, DataStore | console output |
| seats | Muestra disponibilidad | showtimeId, DataStore | console output |
| buy | Orquesta flujo completo | params, DataStore | confirmation or error |

---

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 6 |
| Must Have | 6 |
| Should Have | 0 |
| Could Have | 0 |

---

## Dependencies

### Depends On
| Unit | Reason |
|------|--------|
| 001-ticketing-domain | buy command calls validateSeats, calculatePrice, applyDiscount, generateConfirmation |

### Depended By
None (final unit)

---

## Technical Context

### Suggested Technology
- Commander.js for CLI parsing
- Node fs (sync) for JSON read/write
- path.join for cross-platform paths

### Data Storage
| Data | Type | Location |
|------|------|----------|
| Mock movies | JSON | data/movies.json |
| Mock showtimes | JSON | data/showtimes.json |
| Mock seats | JSON | data/seats.json |
| Purchases | JSON | data/purchases.json |

---

## Constraints

- CLI must NOT contain business logic (pure delegation to domain)
- Persistence must be isolatable for tests (configurable data path)
- All commands must work on Win/Mac/Linux
- Exit code 0 on success, 1 on error

---

## Success Criteria

### Functional
- [ ] `billboard` lists all movies from JSON
- [ ] `showtimes --movie <id>` shows functions for that movie
- [ ] `seats --showtime <id>` shows availability
- [ ] `buy` completes purchase and persists it
- [ ] Subsequent `seats` shows purchased seats as occupied
- [ ] Error cases return exit code 1 with descriptive message

### Quality
- [ ] Integration tests with fixture JSON
- [ ] Tests don't share state (isolated data dir per test)
- [ ] No business logic in command handlers
- [ ] npm scripts work for all commands
