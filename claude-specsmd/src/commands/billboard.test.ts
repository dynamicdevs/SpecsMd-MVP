import { describe, it, expect } from 'vitest';
import { formatBillboard } from './billboard';
import type { Dataset } from '../data/loader';

const dataset: Dataset = {
  movies: [
    { id: 'm1', title: 'Dune: Part Two', formats: ['2D', '3D', 'IMAX'] },
    { id: 'm2', title: 'Inside Out 2', formats: ['2D', '3D'] },
  ],
  showtimes: [],
};

describe('formatBillboard', () => {
  it('lists every movie with id, title, and formats', () => {
    const output = formatBillboard(dataset);
    expect(output).toContain('[m1] Dune: Part Two (2D, 3D, IMAX)');
    expect(output).toContain('[m2] Inside Out 2 (2D, 3D)');
  });

  it('handles an empty billboard', () => {
    expect(formatBillboard({ movies: [], showtimes: [] })).toBe('No movies are currently showing.');
  });
});
