import { describe, it, expect } from 'vitest';
import { formatSeats } from './seats';
import { UnknownShowtimeError } from './errors';
import type { Dataset } from '../data/loader';

const dataset: Dataset = {
  movies: [{ id: 'm1', title: 'Dune: Part Two', formats: ['IMAX'] }],
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
        { code: 'B1', status: 'available' },
      ],
    },
  ],
};

describe('formatSeats', () => {
  it('renders availability and lists only available seats', () => {
    const output = formatSeats(dataset, 'st1');
    expect(output).toContain('A1 [O]');
    expect(output).toContain('A2 [X]');
    expect(output).toContain('Available: A1, B1');
    expect(output).not.toContain('Available: A1, A2, B1');
  });

  it('throws UnknownShowtimeError for an unknown showtime id', () => {
    try {
      formatSeats(dataset, 'zzz');
      throw new Error('expected UnknownShowtimeError');
    } catch (err) {
      expect(err).toBeInstanceOf(UnknownShowtimeError);
      expect((err as UnknownShowtimeError).showtimeId).toBe('zzz');
    }
  });
});
