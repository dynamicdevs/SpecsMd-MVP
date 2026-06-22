import type { Cents } from './types';

/** The Tuesday discount rate (20% off the subtotal). */
export const TUESDAY_DISCOUNT_RATE = 0.2;

export interface DiscountResult {
  discountCents: Cents;
  totalCents: Cents;
}

/** Round to the nearest whole cent, with halves rounding up. */
function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5);
}

/**
 * Whether the given date falls on a Tuesday.
 *
 * Uses the UTC weekday so behavior is deterministic regardless of the host
 * timezone (showtime dates are treated as UTC instants).
 */
export function isTuesday(date: Date): boolean {
  return date.getUTCDay() === 2; // 0 = Sunday, 2 = Tuesday
}

/**
 * Apply the Tuesday discount to a subtotal.
 *
 * On a Tuesday the discount is `round(subtotal × rate)` (half-up); on any other
 * day there is no discount. The date is passed in (not read from the wall clock)
 * to keep the rule deterministic and testable.
 */
export function applyTuesdayDiscount(
  subtotalCents: Cents,
  showtimeDate: Date,
  rate: number = TUESDAY_DISCOUNT_RATE,
): DiscountResult {
  const discountCents = isTuesday(showtimeDate) ? roundHalfUp(subtotalCents * rate) : 0;
  return { discountCents, totalCents: subtotalCents - discountCents };
}
