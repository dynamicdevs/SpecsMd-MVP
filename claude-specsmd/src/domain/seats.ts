import type { Seat, Showtime } from './types';
import {
  DuplicateSeatError,
  EmptySeatSelectionError,
  SeatUnavailableError,
  UnknownSeatError,
} from './errors';

/** Normalize a seat code for case-insensitive comparison (e.g. ` b4 ` → `B4`). */
export function normalizeSeatCode(code: string): string {
  return code.trim().toUpperCase();
}

/**
 * Validate a requested seat selection against a showtime.
 *
 * All-or-nothing: throws a typed error naming the offending seat(s) if the
 * selection is empty, contains duplicates, references unknown codes, or includes
 * any already-sold seat. Returns normally when every requested seat exists and
 * is available.
 */
export function validateSeatSelection(showtime: Showtime, requestedCodes: string[]): void {
  const normalized = requestedCodes.map(normalizeSeatCode);

  if (normalized.length === 0) {
    throw new EmptySeatSelectionError();
  }

  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const code of normalized) {
    if (seen.has(code)) {
      duplicates.add(code);
    }
    seen.add(code);
  }
  if (duplicates.size > 0) {
    throw new DuplicateSeatError([...duplicates]);
  }

  const byCode = new Map<string, Seat>(
    showtime.seats.map((seat) => [normalizeSeatCode(seat.code), seat]),
  );

  const unknown = normalized.filter((code) => !byCode.has(code));
  if (unknown.length > 0) {
    throw new UnknownSeatError(unknown);
  }

  const sold = normalized.filter((code) => byCode.get(code)?.status === 'sold');
  if (sold.length > 0) {
    throw new SeatUnavailableError(sold);
  }
}
