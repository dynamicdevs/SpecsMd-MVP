import { describe, it, expect } from 'vitest';
import { runBuy } from './buy';
import { loadDataset } from '../data/loader';
import { MissingCustomerNameError, SeatUnavailableError, UnknownSeatError } from '../domain';
import { UnknownMovieError, UnknownShowtimeError } from './errors';

const dataset = loadDataset();

describe('runBuy', () => {
  it('prices and confirms a Tuesday IMAX purchase with the 20% discount', () => {
    const { confirmation, order } = runBuy(dataset, {
      movieId: 'm1',
      showtimeId: 'st1', // 2026-06-23 (Tuesday), IMAX
      seatCodes: ['A1', 'A3'],
      customerName: 'Ana',
    });
    expect(order.subtotalCents).toBe(3200); // 2 × (1000 + 600)
    expect(order.discountCents).toBe(640); // 20%
    expect(order.totalCents).toBe(2560);
    expect(confirmation.movieTitle).toBe('Dune: Part Two');
    expect(confirmation.seatCodes).toEqual(['A1', 'A3']);
    expect(confirmation.confirmationId).toMatch(/^CINE-[0-9A-F]{8}$/);
  });

  it('applies no discount on a non-Tuesday showtime', () => {
    const { order } = runBuy(dataset, {
      movieId: 'm1',
      showtimeId: 'st2', // 2026-06-24 (Wednesday), 3D
      seatCodes: ['A2', 'A3'],
      customerName: 'Ben',
    });
    expect(order.subtotalCents).toBe(2600); // 2 × (1000 + 300)
    expect(order.discountCents).toBe(0);
    expect(order.totalCents).toBe(2600);
  });

  it('rejects an already-sold seat (all-or-nothing)', () => {
    expect(() =>
      runBuy(dataset, {
        movieId: 'm1',
        showtimeId: 'st1',
        seatCodes: ['A1', 'A2'], // A2 is sold
        customerName: 'Ana',
      }),
    ).toThrow(SeatUnavailableError);
  });

  it('rejects an unknown seat code', () => {
    expect(() =>
      runBuy(dataset, {
        movieId: 'm1',
        showtimeId: 'st1',
        seatCodes: ['Z9'],
        customerName: 'Ana',
      }),
    ).toThrow(UnknownSeatError);
  });

  it('rejects an unknown movie id', () => {
    expect(() =>
      runBuy(dataset, { movieId: 'zzz', showtimeId: 'st1', seatCodes: ['A1'], customerName: 'Ana' }),
    ).toThrow(UnknownMovieError);
  });

  it('rejects an unknown showtime id', () => {
    expect(() =>
      runBuy(dataset, { movieId: 'm1', showtimeId: 'stX', seatCodes: ['A1'], customerName: 'Ana' }),
    ).toThrow(UnknownShowtimeError);
  });

  it('rejects an empty customer name', () => {
    expect(() =>
      runBuy(dataset, { movieId: 'm1', showtimeId: 'st1', seatCodes: ['A1'], customerName: '  ' }),
    ).toThrow(MissingCustomerNameError);
  });
});
