import { DiscountResult } from './types.js';

const TUESDAY = 2;
const DISCOUNT_RATE = 0.20;

/**
 * Applies 20% discount if the showtime date falls on a Tuesday.
 * The day is determined from the showtime date string, not from the current date.
 * Returns integer amounts (Math.round applied after discount).
 */
export function applyDiscount(subtotal: number, showtimeDate: string): DiscountResult {
  const date = new Date(showtimeDate + 'T00:00:00');

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: "${showtimeDate}"`);
  }

  const dayOfWeek = date.getUTCDay();
  const isTuesday = dayOfWeek === TUESDAY;

  if (!isTuesday) {
    return {
      total: subtotal,
      discountApplied: false,
      discountAmount: 0,
    };
  }

  const discountAmount = Math.round(subtotal * DISCOUNT_RATE);
  const total = subtotal - discountAmount;

  return {
    total,
    discountApplied: true,
    discountAmount,
  };
}
