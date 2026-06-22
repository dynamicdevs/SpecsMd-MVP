import { describe, it, expect } from 'vitest';
import { applyDiscount } from './discount.js';

describe('applyDiscount', () => {
  // 2026-06-23 is a Tuesday
  it('applies 20% discount on Tuesday', () => {
    const result = applyDiscount(10000, '2026-06-23');
    expect(result).toEqual({
      total: 8000,
      discountApplied: true,
      discountAmount: 2000,
    });
  });

  // 2026-06-22 is a Monday
  it('no discount on Monday', () => {
    const result = applyDiscount(10000, '2026-06-22');
    expect(result).toEqual({
      total: 10000,
      discountApplied: false,
      discountAmount: 0,
    });
  });

  // 2026-06-25 is a Thursday
  it('no discount on Thursday', () => {
    const result = applyDiscount(7000, '2026-06-25');
    expect(result).toEqual({
      total: 7000,
      discountApplied: false,
      discountAmount: 0,
    });
  });

  it('rounds discount to integer', () => {
    // 20% of 3333 = 666.6 → rounds to 667
    const result = applyDiscount(3333, '2026-06-23');
    expect(result.discountAmount).toBe(667);
    expect(result.total).toBe(3333 - 667);
  });

  it('handles zero subtotal', () => {
    const result = applyDiscount(0, '2026-06-23');
    expect(result.total).toBe(0);
  });

  it('throws on invalid date', () => {
    expect(() => applyDiscount(10000, 'not-a-date')).toThrow('Invalid date');
  });
});
