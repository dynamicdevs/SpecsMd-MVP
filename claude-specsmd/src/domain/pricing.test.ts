import { describe, it, expect } from 'vitest';
import { priceSeats, DEFAULT_PRICING } from './pricing';

describe('priceSeats', () => {
  it('prices 2D seats at base price', () => {
    expect(priceSeats('2D', 2)).toBe(2000); // 2 × $10.00
  });

  it('prices 3D seats at base + 3D surcharge', () => {
    expect(priceSeats('3D', 2)).toBe(2600); // 2 × ($10.00 + $3.00)
  });

  it('prices IMAX seats at base + IMAX surcharge', () => {
    expect(priceSeats('IMAX', 3)).toBe(4800); // 3 × ($10.00 + $6.00)
  });

  it('returns 0 for zero seats', () => {
    expect(priceSeats('IMAX', 0)).toBe(0);
  });

  it('keeps the IMAX surcharge strictly greater than the 3D surcharge', () => {
    expect(DEFAULT_PRICING.surchargeCents.IMAX).toBeGreaterThan(
      DEFAULT_PRICING.surchargeCents['3D'],
    );
  });

  it('honors an injected pricing config', () => {
    const config = { baseCents: 1500, surchargeCents: { '2D': 0, '3D': 500, IMAX: 900 } };
    expect(priceSeats('3D', 1, config)).toBe(2000);
  });

  it('rejects non-integer or negative seat counts', () => {
    expect(() => priceSeats('2D', 1.5)).toThrow(RangeError);
    expect(() => priceSeats('2D', -1)).toThrow(RangeError);
  });
});
