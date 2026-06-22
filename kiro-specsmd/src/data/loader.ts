import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Movie, Showtime, Seat } from '../domain/types.js';

export interface Purchase {
  showtimeId: string;
  seats: string[];
}

export interface DataStore {
  movies: Movie[];
  showtimes: Showtime[];
  seats: Record<string, Seat[]>;
  purchases: Purchase[];
}

/**
 * Loads all mock data from the specified directory.
 * Merges purchase history into seat status.
 * @param dataDir - Path to directory containing JSON fixtures
 */
export function loadData(dataDir: string): DataStore {
  const movies = loadJson<Movie[]>(join(dataDir, 'movies.json'));
  const showtimes = loadJson<Showtime[]>(join(dataDir, 'showtimes.json'));
  const seats = loadJson<Record<string, Seat[]>>(join(dataDir, 'seats.json'));
  const purchases = loadPurchases(dataDir);

  // Merge purchase history: mark sold seats
  for (const purchase of purchases) {
    const showtimeSeats = seats[purchase.showtimeId];
    if (showtimeSeats) {
      for (const seat of showtimeSeats) {
        if (purchase.seats.includes(seat.id)) {
          seat.status = 'sold';
        }
      }
    }
  }

  return { movies, showtimes, seats, purchases };
}

/**
 * Loads purchases from purchases.json. Returns empty array if file doesn't exist.
 */
function loadPurchases(dataDir: string): Purchase[] {
  const filePath = join(dataDir, 'purchases.json');
  if (!existsSync(filePath)) {
    return [];
  }
  return loadJson<Purchase[]>(filePath);
}

/**
 * Generic JSON file loader with error handling.
 */
function loadJson<T>(filePath: string): T {
  if (!existsSync(filePath)) {
    throw new Error(`Data file not found: ${filePath}`);
  }

  const content = readFileSync(filePath, 'utf-8');

  try {
    return JSON.parse(content) as T;
  } catch {
    throw new Error(`Invalid JSON in file: ${filePath}`);
  }
}
