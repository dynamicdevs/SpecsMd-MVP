import { describe, it, expect } from 'vitest';
import { applyTuesdayDiscount, isTuesday } from './discount';

// 2026-06-23 is a Tuesday; 2026-06-24 is a Wednesday (UTC).
const TUESDAY = new Date('2026-06-23T19:00:00Z');
const WEDNESDAY = new Date('2026-06-24T19:00:00Z');

describe('isTuesday', () => {
  it('recognizes a Tuesday', () => {
    expect(isTuesday(TUESDAY)).toBe(true);
  });

  it('rejects a non-Tuesday', () => {
    expect(isTuesday(WEDNESDAY)).toBe(false);
  });
});

describe('applyTuesdayDiscount', () => {
  it('applies 20% off on a Tuesday', () => {
    expect(applyTuesdayDiscount(2000, TUESDAY)).toEqual({
      discountCents: 400,
      totalCents: 1600,
    });
  });

  it('applies no discount on other days', () => {
    expect(applyTuesdayDiscount(2000, WEDNESDAY)).toEqual({
      discountCents: 0,
      totalCents: 2000,
    });
  });

  it('rounds the discount half-up to whole cents', () => {
    // 2503 × 0.2 = 500.6 → rounds up to 501
    expect(applyTuesdayDiscount(2503, TUESDAY)).toEqual({
      discountCents: 501,
      totalCents: 2002,
    });
  });
});
