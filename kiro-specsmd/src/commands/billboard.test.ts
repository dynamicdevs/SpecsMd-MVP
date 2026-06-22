import { describe, it, expect, vi, beforeEach } from 'vitest';
import { billboard } from './billboard.js';
import { DataStore } from '../data/loader.js';

const mockData: DataStore = {
  movies: [
    { id: 'movie-001', title: 'Test Movie', formats: ['2D', '3D'] },
    { id: 'movie-002', title: 'Another Film', formats: ['IMAX'] },
  ],
  showtimes: [],
  seats: {},
  purchases: [],
};

describe('billboard command', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('lists all movies', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    billboard(mockData);

    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('Test Movie');
    expect(output).toContain('Another Film');
    expect(output).toContain('2D, 3D');
    expect(output).toContain('IMAX');
  });

  it('shows message when no movies', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    billboard({ ...mockData, movies: [] });

    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('No movies available');
  });
});
