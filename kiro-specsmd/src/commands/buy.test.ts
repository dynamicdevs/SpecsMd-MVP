import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buy } from './buy.js';
import { DataStore } from '../data/loader.js';
import { mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TEST_DIR = join(import.meta.dirname, '__test_buy_fixtures__');

const baseMockData: DataStore = {
  movies: [
    { id: 'movie-001', title: 'Test Movie', formats: ['3D'] },
  ],
  showtimes: [
    // Tuesday (2026-06-23 is a Tuesday)
    { id: 'st-001', movieId: 'movie-001', date: '2026-06-23', time: '20:30', format: '3D', room: 'S2' },
    // Monday (2026-06-22)
    { id: 'st-002', movieId: 'movie-001', date: '2026-06-22', time: '18:00', format: '3D', room: 'S1' },
  ],
  seats: {
    'st-001': [
      { id: 'A1', row: 'A', number: 1, status: 'free' },
      { id: 'A2', row: 'A', number: 2, status: 'free' },
      { id: 'A3', row: 'A', number: 3, status: 'sold' },
    ],
    'st-002': [
      { id: 'A1', row: 'A', number: 1, status: 'free' },
      { id: 'A2', row: 'A', number: 2, status: 'free' },
    ],
  },
  purchases: [],
};

describe('buy command', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
    mkdirSync(TEST_DIR, { recursive: true });
    // Write minimal fixtures for persistence
    writeFileSync(join(TEST_DIR, 'movies.json'), JSON.stringify(baseMockData.movies));
    writeFileSync(join(TEST_DIR, 'showtimes.json'), JSON.stringify(baseMockData.showtimes));
    writeFileSync(join(TEST_DIR, 'seats.json'), JSON.stringify(baseMockData.seats));
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('completes purchase for valid seats', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    buy({ showtime: 'st-001', seats: 'A1,A2', customer: 'Juan' }, baseMockData, TEST_DIR);

    expect(process.exitCode).toBeUndefined();
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('Purchase Confirmation');
    expect(output).toContain('Juan');
    expect(output).toContain('Test Movie');
    expect(output).toContain('A1, A2');
  });

  it('shows Tuesday discount', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    buy({ showtime: 'st-001', seats: 'A1', customer: 'María' }, baseMockData, TEST_DIR);

    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('Tuesday');
    expect(output).toContain('Discount');
  });

  it('no discount on non-Tuesday', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    buy({ showtime: 'st-002', seats: 'A1', customer: 'Carlos' }, baseMockData, TEST_DIR);

    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).not.toContain('Discount');
  });

  it('rejects sold seats', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    buy({ showtime: 'st-001', seats: 'A3', customer: 'Juan' }, baseMockData, TEST_DIR);

    expect(process.exitCode).toBe(1);
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('already sold');
  });

  it('rejects non-existent seats', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    buy({ showtime: 'st-001', seats: 'Z9', customer: 'Juan' }, baseMockData, TEST_DIR);

    expect(process.exitCode).toBe(1);
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('does not exist');
  });

  it('rejects invalid showtime', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    buy({ showtime: 'invalid', seats: 'A1', customer: 'Juan' }, baseMockData, TEST_DIR);

    expect(process.exitCode).toBe(1);
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('not found');
  });

  it('rejects missing arguments', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    buy({ showtime: '', seats: '', customer: '' }, baseMockData, TEST_DIR);

    expect(process.exitCode).toBe(1);
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('required');
  });

  it('persists purchase to JSON file', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    buy({ showtime: 'st-001', seats: 'A1', customer: 'Test User' }, baseMockData, TEST_DIR);

    const purchases = JSON.parse(readFileSync(join(TEST_DIR, 'purchases.json'), 'utf-8'));
    expect(purchases).toHaveLength(1);
    expect(purchases[0].showtimeId).toBe('st-001');
    expect(purchases[0].seats).toEqual(['A1']);
    expect(purchases[0].customer).toBe('Test User');
  });

  it('generates deterministic confirmation ID', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    buy({ showtime: 'st-001', seats: 'A1,A2', customer: 'Juan' }, baseMockData, TEST_DIR);

    const output1 = spy.mock.calls.map((c) => c[0]).join('\n');
    const idMatch = output1.match(/ID:\s+([a-f0-9]{8})/);
    expect(idMatch).not.toBeNull();

    // Run again — same ID
    spy.mockClear();
    rmSync(join(TEST_DIR, 'purchases.json'), { force: true });
    buy({ showtime: 'st-001', seats: 'A1,A2', customer: 'Juan' }, baseMockData, TEST_DIR);

    const output2 = spy.mock.calls.map((c) => c[0]).join('\n');
    const idMatch2 = output2.match(/ID:\s+([a-f0-9]{8})/);
    expect(idMatch2![1]).toBe(idMatch![1]);
  });
});
