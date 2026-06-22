import type { Dataset } from '../data/loader';
import { UnknownShowtimeError } from './errors';

/**
 * Render the seat map for a given showtime id, marking each seat available (O)
 * or sold (X), followed by the list of available seat codes.
 *
 * @throws {UnknownShowtimeError} when the showtime id is not in the dataset.
 */
export function formatSeats(dataset: Dataset, showtimeId: string): string {
  const showtime = dataset.showtimes.find((s) => s.id === showtimeId);
  if (!showtime) {
    throw new UnknownShowtimeError(showtimeId);
  }

  const lines = [
    `Seats for showtime ${showtime.id} (${showtime.format}, ${showtime.screen}):`,
    '  Legend: O = available, X = sold',
  ];
  for (const seat of showtime.seats) {
    const mark = seat.status === 'sold' ? 'X' : 'O';
    lines.push(`  ${seat.code} [${mark}]`);
  }

  const available = showtime.seats.filter((s) => s.status === 'available').map((s) => s.code);
  lines.push('');
  lines.push(available.length > 0 ? `Available: ${available.join(', ')}` : 'No seats available.');
  return lines.join('\n');
}
