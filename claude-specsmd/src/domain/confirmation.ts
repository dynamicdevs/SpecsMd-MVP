import type { Confirmation, Order } from './types';
import { MissingCustomerNameError } from './errors';

/**
 * Deterministic 32-bit FNV-1a hash rendered as 8 uppercase hex chars.
 * Used for reproducible confirmation IDs (no randomness, no clock).
 */
function fnv1aHex(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Build a purchase confirmation for a priced order.
 *
 * The confirmation ID is derived deterministically from the order, movie title,
 * customer name, and an optional `seed`, so the same inputs always yield the
 * same ID (reproducible in tests). Validation and pricing must have already
 * succeeded before calling this.
 */
export function generateConfirmation(
  order: Order,
  movieTitle: string,
  customerName: string,
  seed = '',
): Confirmation {
  const name = customerName.trim();
  if (name.length === 0) {
    throw new MissingCustomerNameError();
  }

  const fingerprint = [
    seed,
    order.showtime.id,
    order.seatCodes.join(','),
    name,
    String(order.totalCents),
  ].join('|');

  return {
    confirmationId: `CINE-${fnv1aHex(fingerprint)}`,
    movieTitle,
    showtime: order.showtime,
    seatCodes: order.seatCodes,
    customerName: name,
    totalCents: order.totalCents,
  };
}
