import { createHash } from 'node:crypto';
import { Confirmation, PurchaseInput } from './types.js';

/**
 * Generates a deterministic confirmation from purchase data.
 * The confirmation ID is derived via SHA-256 hash of normalized input.
 * Same inputs always produce the same confirmation ID.
 */
export function generateConfirmation(input: PurchaseInput): Confirmation {
  const sortedSeats = [...input.seats].sort();
  const hashInput = `${input.customer}|${input.showtimeId}|${sortedSeats.join(',')}`;
  const hash = createHash('sha256').update(hashInput).digest('hex');
  const confirmationId = hash.substring(0, 8);

  return {
    confirmationId,
    customer: input.customer,
    movieTitle: input.movieTitle,
    showtimeDate: input.showtimeDate,
    showtimeTime: input.showtimeTime,
    format: input.format,
    seats: sortedSeats,
    subtotal: input.subtotal,
    discountApplied: input.discountApplied,
    discountAmount: input.discountAmount,
    total: input.total,
  };
}
