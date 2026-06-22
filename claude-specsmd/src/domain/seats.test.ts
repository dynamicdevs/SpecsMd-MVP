import { describe, it, expect } from 'vitest';
import { validateSeatSelection } from './seats';
import {
  DuplicateSeatError,
  EmptySeatSelectionError,
  SeatUnavailableError,
  UnknownSeatError,
} from './errors';
import type { Showtime } from './types';

const showtime: Showtime = {
  id: 'st-1',
  movieId: 'm-1',
  startsAt: '2026-06-23T19:00:00Z',
  format: 'IMAX',
  screen: 'Hall 1',
  seats: [
    { code: 'A1', status: 'available' },
    { code: 'A2', status: 'sold' },
    { code: 'B1', status: 'available' },
  ],
};

describe('validateSeatSelection', () => {
  it('passes for available seats', () => {
    expect(() => validateSeatSelection(showtime, ['A1', 'B1'])).not.toThrow();
  });

  it('is case- and whitespace-insensitive', () => {
    expect(() => validateSeatSelection(showtime, [' a1 ', 'b1'])).not.toThrow();
  });

  it('rejects an empty selection', () => {
    expect(() => validateSeatSelection(showtime, [])).toThrow(EmptySeatSelectionError);
  });

  it('rejects duplicate seat codes', () => {
    expect(() => validateSeatSelection(showtime, ['A1', 'A1'])).toThrow(DuplicateSeatError);
  });

  it('rejects unknown seat codes and names them', () => {
    try {
      validateSeatSelection(showtime, ['Z9']);
      throw new Error('expected UnknownSeatError');
    } catch (err) {
      expect(err).toBeInstanceOf(UnknownSeatError);
      expect((err as UnknownSeatError).codes).toEqual(['Z9']);
    }
  });

  it('rejects already-sold seats and names them', () => {
    try {
      validateSeatSelection(showtime, ['A2']);
      throw new Error('expected SeatUnavailableError');
    } catch (err) {
      expect(err).toBeInstanceOf(SeatUnavailableError);
      expect((err as SeatUnavailableError).codes).toEqual(['A2']);
    }
  });

  it('rejects the whole selection if any seat is sold (all-or-nothing)', () => {
    expect(() => validateSeatSelection(showtime, ['A1', 'A2'])).toThrow(SeatUnavailableError);
  });
});
