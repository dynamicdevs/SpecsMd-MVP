import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildProgram } from './program';

function run(args: string[]): Promise<unknown> {
  return buildProgram().parseAsync(['node', 'cinema', ...args]);
}

beforeEach(() => {
  process.exitCode = 0;
});

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = 0;
});

describe('buildProgram', () => {
  it('prints the billboard', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await run(['billboard']);
    expect(log.mock.calls.flat().join('\n')).toContain('Now Showing:');
    expect(process.exitCode).toBe(0);
  });

  it('prints a confirmation for a valid purchase', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await run(['buy', '--movie=m1', '--showtime=st1', '--seats=A1,A3', '--name=Ana']);
    const output = log.mock.calls.flat().join('\n');
    expect(output).toContain('Purchase Confirmed');
    expect(output).toContain('Total           : $25.60');
    expect(process.exitCode).toBe(0);
  });

  it('reports an error and sets a non-zero exit code for an unknown movie', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await run(['showtimes', '--movie=zzz']);
    expect(error).toHaveBeenCalled();
    expect(error.mock.calls.flat().join('\n')).toContain('Unknown movie id: zzz');
    expect(process.exitCode).toBe(1);
  });
});
