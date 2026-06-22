import type { Dataset } from '../data/loader';

/** Render the movie billboard: one line per movie with id, title, and formats. */
export function formatBillboard(dataset: Dataset): string {
  if (dataset.movies.length === 0) {
    return 'No movies are currently showing.';
  }
  const lines = ['Now Showing:'];
  for (const movie of dataset.movies) {
    lines.push(`  [${movie.id}] ${movie.title} (${movie.formats.join(', ')})`);
  }
  return lines.join('\n');
}
