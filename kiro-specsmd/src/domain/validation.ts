import { Seat, ValidationResult } from './types.js';

/**
 * Validates that all selected seats exist and are free.
 * All-or-nothing: if any seat is invalid, the entire selection is rejected.
 */
export function validateSeats(
  selectedIds: string[],
  availableSeats: Seat[]
): ValidationResult {
  if (selectedIds.length === 0) {
    return { valid: false, error: 'Must select at least one seat' };
  }

  // Deduplicate seat IDs
  const uniqueIds = [...new Set(selectedIds)];

  const seatMap = new Map(availableSeats.map((s) => [s.id, s]));
  const validatedSeats: Seat[] = [];

  for (const id of uniqueIds) {
    const seat = seatMap.get(id);

    if (!seat) {
      return { valid: false, error: `Seat "${id}" does not exist` };
    }

    if (seat.status === 'sold') {
      return { valid: false, error: `Seat "${id}" is already sold` };
    }

    validatedSeats.push(seat);
  }

  return { valid: true, seats: validatedSeats };
}
