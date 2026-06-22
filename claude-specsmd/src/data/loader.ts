import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { Format, Movie, Seat, SeatStatus, Showtime } from '../domain';

/** In-memory catalog loaded from the mock JSON files. */
export interface Dataset {
  movies: Movie[];
  showtimes: Showtime[];
}

/** Raised when mock data is missing or malformed. Names the offending file. */
export class DataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataError';
  }
}

/** Default data directory: the folder this module lives in (works under tsx/compiled). */
const DEFAULT_DATA_DIR = dirname(fileURLToPath(import.meta.url));
const FORMATS: readonly Format[] = ['2D', '3D', 'IMAX'];
const SEAT_STATUSES: readonly SeatStatus[] = ['available', 'sold'];

function readJson(dataDir: string, file: string): unknown {
  const fullPath = join(dataDir, file);
  let raw: string;
  try {
    raw = readFileSync(fullPath, 'utf8');
  } catch {
    throw new DataError(`Could not read data file: ${fullPath}`);
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new DataError(`Invalid JSON in data file: ${fullPath}`);
  }
}

function asRecord(value: unknown, file: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new DataError(`Expected an object in ${file}`);
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown, field: string, file: string): string {
  if (typeof value !== 'string') {
    throw new DataError(`Expected string for "${field}" in ${file}`);
  }
  return value;
}

function parseFormat(value: unknown, file: string): Format {
  const s = asString(value, 'format', file);
  if (!FORMATS.includes(s as Format)) {
    throw new DataError(`Invalid format "${s}" in ${file}`);
  }
  return s as Format;
}

function parseSeat(value: unknown, file: string): Seat {
  const record = asRecord(value, file);
  const code = asString(record.code, 'seat.code', file);
  const status = asString(record.status, 'seat.status', file);
  if (!SEAT_STATUSES.includes(status as SeatStatus)) {
    throw new DataError(`Invalid seat status "${status}" in ${file}`);
  }
  return { code, status: status as SeatStatus };
}

function parseMovie(value: unknown, file: string): Movie {
  const record = asRecord(value, file);
  const id = asString(record.id, 'movie.id', file);
  const title = asString(record.title, 'movie.title', file);
  if (!Array.isArray(record.formats)) {
    throw new DataError(`Expected "formats" array for movie ${id} in ${file}`);
  }
  return { id, title, formats: record.formats.map((f) => parseFormat(f, file)) };
}

function parseShowtime(value: unknown, file: string): Showtime {
  const record = asRecord(value, file);
  const id = asString(record.id, 'showtime.id', file);
  const movieId = asString(record.movieId, 'showtime.movieId', file);
  const startsAt = asString(record.startsAt, 'showtime.startsAt', file);
  const format = parseFormat(record.format, file);
  const screen = asString(record.screen, 'showtime.screen', file);
  if (!Array.isArray(record.seats)) {
    throw new DataError(`Expected "seats" array for showtime ${id} in ${file}`);
  }
  return { id, movieId, startsAt, format, screen, seats: record.seats.map((s) => parseSeat(s, file)) };
}

/**
 * Load and validate the mock catalog from `movies.json` and `showtimes.json`.
 * Deterministic: the same files always yield the same dataset.
 *
 * @throws {DataError} when a file is missing, is not valid JSON, or has the wrong shape.
 */
export function loadDataset(dataDir: string = DEFAULT_DATA_DIR): Dataset {
  const moviesRaw = readJson(dataDir, 'movies.json');
  const showtimesRaw = readJson(dataDir, 'showtimes.json');
  if (!Array.isArray(moviesRaw)) {
    throw new DataError('Expected an array in movies.json');
  }
  if (!Array.isArray(showtimesRaw)) {
    throw new DataError('Expected an array in showtimes.json');
  }
  return {
    movies: moviesRaw.map((m) => parseMovie(m, 'movies.json')),
    showtimes: showtimesRaw.map((s) => parseShowtime(s, 'showtimes.json')),
  };
}
