import type { Cents, Format } from './types';

/** Configurable pricing model. Injected so tests can pin exact values. */
export interface PricingConfig {
  baseCents: Cents;
  surchargeCents: Record<Format, Cents>;
}

/**
 * Approved pricing: 2D = base ($10.00), 3D = base + $3.00, IMAX = base + $6.00.
 * IMAX surcharge is strictly greater than the 3D surcharge.
 */
export const DEFAULT_PRICING: PricingConfig = {
  baseCents: 1000,
  surchargeCents: { '2D': 0, '3D': 300, IMAX: 600 },
};

/**
 * Compute the pre-discount subtotal for `seatCount` seats at the given format.
 *
 * @returns subtotal in integer cents (`seatCount × (base + surcharge[format])`).
 */
export function priceSeats(
  format: Format,
  seatCount: number,
  config: PricingConfig = DEFAULT_PRICING,
): Cents {
  if (!Number.isInteger(seatCount) || seatCount < 0) {
    throw new RangeError(`seatCount must be a non-negative integer, got ${seatCount}`);
  }
  const perSeatCents = config.baseCents + config.surchargeCents[format];
  return perSeatCents * seatCount;
}
