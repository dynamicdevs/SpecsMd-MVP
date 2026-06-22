import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadData } from './loader.js';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const TEST_DIR = join(import.meta.dirname, '__test_fixtures__');

function writeFixture(name: string, data: unknown): void {
  writeFileSync(join(TEST_DIR, name), JSON.stringify(data, null, 2));
}

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('loadData', () => {
  it('loads all data files correctly', () => {
    writeFixture('movies.json', [{ id: 'm1', title: 'Test', formats: ['2D'] }]);
    writeFixture('showtimes.json', [{ id: 'st1', movieId: 'm1', date: '2026-01-01', time: '18:00', format: '2D', room: 'S1' }]);
    writeFixture('seats.json', { 'st1': [{ id: 'A1', row: 'A', number: 1, status: 'free' }] });

    const data = loadData(TEST_DIR);
    expect(data.movies).toHaveLength(1);
    expect(data.showtimes).toHaveLength(1);
    expect(data.seats['st1']).toHaveLength(1);
    expect(data.purchases).toEqual([]);
  });

  it('merges purchases into seat status', () => {
    writeFixture('movies.json', []);
    writeFixture('showtimes.json', []);
    writeFixture('seats.json', {
      'st1': [
        { id: 'A1', row: 'A', number: 1, status: 'free' },
        { id: 'A2', row: 'A', number: 2, status: 'free' },
      ],
    });
    writeFixture('purchases.json', [{ showtimeId: 'st1', seats: ['A1'] }]);

    const data = loadData(TEST_DIR);
    expect(data.seats['st1'][0].status).toBe('sold');
    expect(data.seats['st1'][1].status).toBe('free');
  });

  it('throws on missing movies.json', () => {
    writeFixture('showtimes.json', []);
    writeFixture('seats.json', {});

    expect(() => loadData(TEST_DIR)).toThrow('Data file not found');
  });

  it('throws on invalid JSON', () => {
    writeFileSync(join(TEST_DIR, 'movies.json'), 'not json{{{');
    writeFixture('showtimes.json', []);
    writeFixture('seats.json', {});

    expect(() => loadData(TEST_DIR)).toThrow('Invalid JSON');
  });

  it('returns empty purchases if file does not exist', () => {
    writeFixture('movies.json', []);
    writeFixture('showtimes.json', []);
    writeFixture('seats.json', {});

    const data = loadData(TEST_DIR);
    expect(data.purchases).toEqual([]);
  });
});
