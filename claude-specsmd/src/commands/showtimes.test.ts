import { describe, it, expect } from 'vitest';
import { formatShowtimes } from './showtimes';
import { UnknownMovieError } from './errors';
import type { Dataset } from '../data/loader';

const dataset: Dataset = {
  movies: [
    { id: 'm1', title: 'Dune: Part Two', formats: ['IMAX'] },
    { id: 'm2', title: 'No Screenings', formats: ['2D'] },
  ],
  showtimes: [
    {
      id: 'st1',
      movieId: 'm1',
      startsAt: '2026-06-23T19:00:00Z',
      format: 'IMAX',
      screen: 'IMAX Hall',
      seats: [
        { code: 'A1', status: 'available' },
        { code: 'A2', status: 'sold' },
      ],
    },
  ],
};

describe('formatShowtimes', () => {
  it('lists the showtimes for a movie with available seat counts', () => {
    const output = formatShowtimes(dataset, 'm1');
    expect(output).toContain('Showtimes for Dune: Part Two:');
    expect(output).toContain('[st1]');
    expect(output).toContain('1 seat(s) available');
  });

  it('reports when a known movie has no showtimes', () => {
    expect(formatShowtimes(dataset, 'm2')).toBe('No showtimes available for No Screenings.');
  });

  it('throws UnknownMovieError for an unknown movie id', () => {
    try {
      formatShowtimes(dataset, 'zzz');
      throw new Error('expected UnknownMovieError');
    } catch (err) {
      expect(err).toBeInstanceOf(UnknownMovieError);
      expect((err as UnknownMovieError).movieId).toBe('zzz');
    }
  });
});
