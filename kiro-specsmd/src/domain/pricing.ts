import { ScreenFormat } from './types.js';

/** Prices per seat in centavos */
export const PRICES: Record<ScreenFormat, number> = {
  '2D': 5000,
  '3D': 7000,
  'IMAX': 12000,
};

/**
 * Calculates total price based on screen format and seat count.
 * Returns amount in centavos (integer).
 */
export function calculatePrice(format: ScreenFormat, seatCount: number): number {
  const unitPrice = PRICES[format];

  if (unitPrice === undefined) {
    throw new Error(`Unknown screen format: "${format}"`);
  }

  if (seatCount <= 0) {
    throw new Error('Seat count must be at least 1');
  }

  return unitPrice * seatCount;
}
