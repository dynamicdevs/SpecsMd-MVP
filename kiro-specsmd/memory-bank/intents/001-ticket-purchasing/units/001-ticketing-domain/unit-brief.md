---
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
phase: inception
status: ready
created: 2026-06-21T00:00:00Z
updated: 2026-06-21T00:00:00Z
---

# Unit Brief: Ticketing Domain

## Purpose

Pure business logic for cinema ticket purchasing: seat validation, format-based pricing, Tuesday discount calculation, and deterministic confirmation generation. Zero I/O, zero side effects.

## Scope

### In Scope
- Domain types (Movie, Showtime, Seat, Purchase, Confirmation)
- Seat validation (exists + available, all-or-nothing)
- Price calculation by screen format (2D, 3D, IMAX)
- Tuesday discount (20% off)
- Deterministic confirmation ID generation
- Money handling in centavos (integers)

### Out of Scope
- File I/O (reading/writing JSON)
- Console output
- CLI parsing
- Data loading

---

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-4 | Validar selección de asientos | Must |
| FR-5 | Calcular precio por formato | Must |
| FR-6 | Aplicar descuento de martes | Must |
| FR-7 | Generar confirmación de compra | Must |

---

## Domain Concepts

### Key Entities
| Entity | Description | Attributes |
|--------|-------------|------------|
| Movie | Película en cartelera | id, title, formats |
| Showtime | Función de una película | id, movieId, date, time, format, room |
| Seat | Asiento en una sala | id, row, number, status (free/sold) |
| Purchase | Compra confirmada | confirmationId, customer, showtime, seats, total |

### Key Operations
| Operation | Description | Inputs | Outputs |
|-----------|-------------|--------|---------|
| validateSeats | Valida asientos existen y están libres | seatIds, availableSeats | valid or error |
| calculatePrice | Calcula precio por formato × cantidad | format, seatCount | subtotal (centavos) |
| applyDiscount | Aplica 20% si es martes | subtotal, showtimeDate | total (centavos) |
| generateConfirmation | Genera confirmación determinística | purchaseData | Confirmation with ID |

---

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 5 |
| Must Have | 5 |
| Should Have | 0 |
| Could Have | 0 |

---

## Dependencies

### Depends On
None (first unit, pure logic)

### Depended By
| Unit | Reason |
|------|--------|
| 002-ticketing-cli | CLI commands call domain functions |

---

## Technical Context

### Suggested Technology
- Pure TypeScript functions (no classes needed)
- Money in centavos (number integers)
- Crypto for deterministic hashing (confirmation IDs)

### Data Storage
None — this unit has no I/O

---

## Constraints

- NO imports of fs, path, console, or any I/O module
- NO side effects
- ALL functions must be pure (deterministic)
- Money always in centavos (integers, never floats)

---

## Success Criteria

### Functional
- [ ] Seat validation: rejects invalid/sold seats, all-or-nothing
- [ ] Pricing: correct for 2D ($5000), 3D ($7000), IMAX ($12000) per seat
- [ ] Discount: 20% off on Tuesdays, 0% other days
- [ ] Confirmation: includes all fields, deterministic ID

### Quality
- [ ] 100% unit test coverage on domain
- [ ] No `any` types
- [ ] No I/O imports
- [ ] All functions pure and deterministic
