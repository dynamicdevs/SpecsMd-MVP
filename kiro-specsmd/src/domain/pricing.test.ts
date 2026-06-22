import { describe, it, expect } from 'vitest';
import { calculatePrice, PRICES } from './pricing.js';

describe('calculatePrice', () => {
  it('returns 5000 for 2D × 1 seat', () => {
    expect(calculatePrice('2D', 1)).toBe(5000);
  });

  it('returns 7000 for 3D × 1 seat', () => {
    expect(calculatePrice('3D', 1)).toBe(7000);
  });

  it('returns 12000 for IMAX × 1 seat', () => {
    expect(calculatePrice('IMAX', 1)).toBe(12000);
  });

  it('multiplies by seat count', () => {
    expect(calculatePrice('3D', 3)).toBe(21000);
  });

  it('throws on unknown format', () => {
    expect(() => calculatePrice('4D' as any, 1)).toThrow('Unknown screen format');
  });

  it('throws on zero seats', () => {
    expect(() => calculatePrice('2D', 0)).toThrow('Seat count must be at least 1');
  });

  it('throws on negative seats', () => {
    expect(() => calculatePrice('IMAX', -1)).toThrow('Seat count must be at least 1');
  });

  it('exports correct price constants', () => {
    expect(PRICES['2D']).toBe(5000);
    expect(PRICES['3D']).toBe(7000);
    expect(PRICES['IMAX']).toBe(12000);
  });
});
