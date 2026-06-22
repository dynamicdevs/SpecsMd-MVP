import { describe, it, expect, vi, beforeEach } from 'vitest';
import { showtimes } from './showtimes.js';
import { DataStore } from '../data/loader.js';

const mockData: DataStore = {
  movies: [
    { id: 'movie-001', title: 'Test Movie', formats: ['2D'] },
  ],
  showtimes: [
    { id: 'st-001', movieId: 'movie-001', date: '2026-06-22', time: '18:00', format: '2D', room: 'S1' },
    { id: 'st-002', movieId: 'movie-001', date: '2026-06-23', time: '20:00', format: '2D', room: 'S2' },
  ],
  seats: {},
  purchases: [],
};

describe('showtimes command', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it('lists showtimes for valid movie', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    showtimes({ movie: 'movie-001' }, mockData);

    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('st-001');
    expect(output).toContain('2026-06-22');
    expect(output).toContain('18:00');
  });

  it('errors on invalid movie', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    showtimes({ movie: 'invalid-id' }, mockData);

    expect(process.exitCode).toBe(1);
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('not found');
  });

  it('errors on missing --movie option', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    showtimes({ movie: '' }, mockData);

    expect(process.exitCode).toBe(1);
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('required');
  });
});
