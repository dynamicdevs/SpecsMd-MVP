import { describe, it, expect } from 'vitest';
import { generateConfirmation } from './confirmation';
import { MissingCustomerNameError } from './errors';
import type { Order, Showtime } from './types';

const showtime: Showtime = {
  id: 'st-1',
  movieId: 'm-1',
  startsAt: '2026-06-23T19:00:00Z',
  format: 'IMAX',
  screen: 'Hall 1',
  seats: [],
};

const order: Order = {
  showtime,
  seatCodes: ['A1', 'B1'],
  subtotalCents: 3200,
  discountCents: 640,
  totalCents: 2560,
};

describe('generateConfirmation', () => {
  it('includes all required fields', () => {
    const c = generateConfirmation(order, 'Dune', 'Ana', 'seed-1');
    expect(c.movieTitle).toBe('Dune');
    expect(c.customerName).toBe('Ana');
    expect(c.seatCodes).toEqual(['A1', 'B1']);
    expect(c.totalCents).toBe(2560);
    expect(c.showtime).toBe(showtime);
    expect(c.confirmationId).toMatch(/^CINE-[0-9A-F]{8}$/);
  });

  it('is deterministic for the same inputs', () => {
    const a = generateConfirmation(order, 'Dune', 'Ana', 'seed-1');
    const b = generateConfirmation(order, 'Dune', 'Ana', 'seed-1');
    expect(a.confirmationId).toBe(b.confirmationId);
  });

  it('changes the id when the seed changes', () => {
    const a = generateConfirmation(order, 'Dune', 'Ana', 'seed-1');
    const b = generateConfirmation(order, 'Dune', 'Ana', 'seed-2');
    expect(a.confirmationId).not.toBe(b.confirmationId);
  });

  it('trims the customer name and rejects an empty one', () => {
    expect(generateConfirmation(order, 'Dune', '  Ana  ').customerName).toBe('Ana');
    expect(() => generateConfirmation(order, 'Dune', '   ')).toThrow(MissingCustomerNameError);
  });
});
