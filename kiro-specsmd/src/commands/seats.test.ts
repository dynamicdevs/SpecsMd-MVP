import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seats } from './seats.js';
import { DataStore } from '../data/loader.js';

const mockData: DataStore = {
  movies: [],
  showtimes: [
    { id: 'st-001', movieId: 'movie-001', date: '2026-06-22', time: '18:00', format: '2D', room: 'S1' },
  ],
  seats: {
    'st-001': [
      { id: 'A1', row: 'A', number: 1, status: 'free' },
      { id: 'A2', row: 'A', number: 2, status: 'sold' },
      { id: 'A3', row: 'A', number: 3, status: 'free' },
    ],
  },
  purchases: [],
};

describe('seats command', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it('shows seat availability', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    seats({ showtime: 'st-001' }, mockData);

    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('A1');
    expect(output).toContain('A2');
    expect(output).toContain('Available: 2');
    expect(output).toContain('Sold: 1');
  });

  it('errors on invalid showtime', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    seats({ showtime: 'invalid' }, mockData);

    expect(process.exitCode).toBe(1);
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('not found');
  });

  it('errors on missing --showtime option', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    seats({ showtime: '' }, mockData);

    expect(process.exitCode).toBe(1);
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('required');
  });
});
