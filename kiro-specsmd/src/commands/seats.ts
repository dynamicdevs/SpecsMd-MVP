import { DataStore } from '../data/loader.js';

export interface SeatsOptions {
  showtime: string;
}

/**
 * Shows seat availability for a specific showtime.
 */
export function seats(options: SeatsOptions, data: DataStore): void {
  const { showtime: showtimeId } = options;

  if (!showtimeId) {
    console.error('Error: --showtime option is required');
    process.exitCode = 1;
    return;
  }

  const showtimeExists = data.showtimes.some((s) => s.id === showtimeId);
  if (!showtimeExists) {
    console.error(`Error: Showtime "${showtimeId}" not found`);
    process.exitCode = 1;
    return;
  }

  const showtimeSeats = data.seats[showtimeId];
  if (!showtimeSeats || showtimeSeats.length === 0) {
    console.log('No seats configured for this showtime');
    return;
  }

  const showtime = data.showtimes.find((s) => s.id === showtimeId)!;
  const free = showtimeSeats.filter((s) => s.status === 'free').length;
  const sold = showtimeSeats.filter((s) => s.status === 'sold').length;

  console.log(`💺 Seats for ${showtime.date} ${showtime.time} (${showtime.format})\n`);
  console.log(`  Available: ${free} | Sold: ${sold}\n`);

  for (const seat of showtimeSeats) {
    const icon = seat.status === 'free' ? '🟢' : '🔴';
    console.log(`  ${icon} ${seat.row}${seat.number} [${seat.id}]`);
  }
  console.log('');
}
