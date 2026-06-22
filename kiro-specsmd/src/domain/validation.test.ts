import { describe, it, expect } from 'vitest';
import { validateSeats } from './validation.js';
import { Seat } from './types.js';

const mockSeats: Seat[] = [
  { id: 'A1', row: 'A', number: 1, status: 'free' },
  { id: 'A2', row: 'A', number: 2, status: 'free' },
  { id: 'A3', row: 'A', number: 3, status: 'sold' },
  { id: 'B1', row: 'B', number: 1, status: 'free' },
];

describe('validateSeats', () => {
  it('returns valid for free existing seats', () => {
    const result = validateSeats(['A1', 'A2'], mockSeats);
    expect(result).toEqual({
      valid: true,
      seats: [
        { id: 'A1', row: 'A', number: 1, status: 'free' },
        { id: 'A2', row: 'A', number: 2, status: 'free' },
      ],
    });
  });

  it('rejects non-existent seat', () => {
    const result = validateSeats(['A1', 'Z9'], mockSeats);
    expect(result).toEqual({
      valid: false,
      error: 'Seat "Z9" does not exist',
    });
  });

  it('rejects sold seat', () => {
    const result = validateSeats(['A1', 'A3'], mockSeats);
    expect(result).toEqual({
      valid: false,
      error: 'Seat "A3" is already sold',
    });
  });

  it('rejects empty selection', () => {
    const result = validateSeats([], mockSeats);
    expect(result).toEqual({
      valid: false,
      error: 'Must select at least one seat',
    });
  });

  it('deduplicates seat IDs', () => {
    const result = validateSeats(['A1', 'A1', 'A2'], mockSeats);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.seats).toHaveLength(2);
    }
  });

  it('rejects all seats if any one is invalid (all-or-nothing)', () => {
    const result = validateSeats(['A1', 'A2', 'A3'], mockSeats);
    expect(result.valid).toBe(false);
  });
});
