import { DataStore } from '../data/loader.js';

export interface ShowtimesOptions {
  movie: string;
}

/**
 * Lists showtimes for a specific movie.
 */
export function showtimes(options: ShowtimesOptions, data: DataStore): void {
  const { movie: movieId } = options;

  if (!movieId) {
    console.error('Error: --movie option is required');
    process.exitCode = 1;
    return;
  }

  const movieExists = data.movies.some((m) => m.id === movieId);
  if (!movieExists) {
    console.error(`Error: Movie "${movieId}" not found`);
    process.exitCode = 1;
    return;
  }

  const movieShowtimes = data.showtimes.filter((s) => s.movieId === movieId);
  const movie = data.movies.find((m) => m.id === movieId)!;

  if (movieShowtimes.length === 0) {
    console.log(`No showtimes available for "${movie.title}"`);
    return;
  }

  console.log(`🕐 Showtimes for "${movie.title}"\n`);
  for (const st of movieShowtimes) {
    console.log(`  [${st.id}] ${st.date} ${st.time} - ${st.format} (${st.room})`);
  }
  console.log('');
}
