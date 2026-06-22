import type { Dataset } from '../data/loader';
import { UnknownMovieError } from './errors';

/**
 * Render the showtimes for a given movie id.
 *
 * @throws {UnknownMovieError} when the movie id is not in the dataset.
 */
export function formatShowtimes(dataset: Dataset, movieId: string): string {
  const movie = dataset.movies.find((m) => m.id === movieId);
  if (!movie) {
    throw new UnknownMovieError(movieId);
  }

  const showtimes = dataset.showtimes.filter((s) => s.movieId === movieId);
  if (showtimes.length === 0) {
    return `No showtimes available for ${movie.title}.`;
  }

  const lines = [`Showtimes for ${movie.title}:`];
  for (const showtime of showtimes) {
    const available = showtime.seats.filter((s) => s.status === 'available').length;
    lines.push(
      `  [${showtime.id}] ${showtime.startsAt} · ${showtime.format} · ${showtime.screen} · ${available} seat(s) available`,
    );
  }
  return lines.join('\n');
}
