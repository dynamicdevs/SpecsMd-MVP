import { describe, it, expect } from 'vitest';
import { formatMoney } from './format';

describe('formatMoney', () => {
  it('renders whole and fractional dollars', () => {
    expect(formatMoney(1000)).toBe('$10.00');
    expect(formatMoney(2560)).toBe('$25.60');
  });

  it('pads cents below ten', () => {
    expect(formatMoney(5)).toBe('$0.05');
  });

  it('handles negative amounts', () => {
    expect(formatMoney(-400)).toBe('-$4.00');
  });
});
