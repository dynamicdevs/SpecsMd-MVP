import { describe, it, expect } from 'vitest';
import { loadDataset, DataError } from './loader';

describe('loadDataset', () => {
  it('loads the bundled mock catalog', () => {
    const dataset = loadDataset();
    expect(dataset.movies).toHaveLength(3);
    expect(dataset.showtimes).toHaveLength(4);
    expect(dataset.movies.map((m) => m.id)).toEqual(['m1', 'm2', 'm3']);
  });

  it('parses seat layouts with availability', () => {
    const dataset = loadDataset();
    const st1 = dataset.showtimes.find((s) => s.id === 'st1');
    expect(st1?.seats.find((s) => s.code === 'A2')?.status).toBe('sold');
    expect(st1?.seats.find((s) => s.code === 'A1')?.status).toBe('available');
  });

  it('throws a DataError when the data directory does not exist', () => {
    expect(() => loadDataset('/no/such/dir')).toThrow(DataError);
  });
});
