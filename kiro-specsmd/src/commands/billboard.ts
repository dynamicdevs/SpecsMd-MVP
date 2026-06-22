import { DataStore } from '../data/loader.js';

/**
 * Lists all movies currently showing.
 */
export function billboard(data: DataStore): void {
  const { movies } = data;

  if (movies.length === 0) {
    console.log('No movies available');
    return;
  }

  console.log('🎬 Billboard\n');
  for (const movie of movies) {
    console.log(`  [${movie.id}] ${movie.title} (${movie.formats.join(', ')})`);
  }
  console.log('');
}
