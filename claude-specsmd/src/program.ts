import { Command } from 'commander';
import { loadDataset } from './data/loader';
import { formatBillboard } from './commands/billboard';
import { formatShowtimes } from './commands/showtimes';
import { formatSeats } from './commands/seats';
import { runBuy } from './commands/buy';
import { formatConfirmation } from './commands/confirmation-view';

/** Print an error and mark the process as failed (non-zero exit). */
function fail(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
}

/**
 * Build the Commander program. Console output and error handling live here
 * (the edge); the underlying command/domain functions stay pure and testable.
 * Exported so tests can drive it via `parseAsync` without spawning a process.
 */
export function buildProgram(): Command {
  const program = new Command();

  program
    .name('cinema')
    .description('Cinema ticket-purchasing CLI (mock data)')
    .version('0.1.0');

  program
    .command('billboard')
    .description('View the movie billboard')
    .action(() => {
      try {
        console.log(formatBillboard(loadDataset()));
      } catch (error) {
        fail(error);
      }
    });

  program
    .command('showtimes')
    .description('List showtimes for a movie')
    .requiredOption('-m, --movie <id>', 'movie id')
    .action((opts: { movie: string }) => {
      try {
        console.log(formatShowtimes(loadDataset(), opts.movie));
      } catch (error) {
        fail(error);
      }
    });

  program
    .command('seats')
    .description('View seats for a showtime')
    .requiredOption('-s, --showtime <id>', 'showtime id')
    .action((opts: { showtime: string }) => {
      try {
        console.log(formatSeats(loadDataset(), opts.showtime));
      } catch (error) {
        fail(error);
      }
    });

  program
    .command('buy')
    .description('Purchase one or more seats')
    .requiredOption('-m, --movie <id>', 'movie id')
    .requiredOption('-s, --showtime <id>', 'showtime id')
    .requiredOption('-S, --seats <codes>', 'comma-separated seat codes, e.g. A1,A2')
    .requiredOption('-n, --name <name>', 'customer name')
    .action((opts: { movie: string; showtime: string; seats: string; name: string }) => {
      try {
        const seatCodes = opts.seats
          .split(',')
          .map((code) => code.trim())
          .filter((code) => code.length > 0);
        const { confirmation, order } = runBuy(loadDataset(), {
          movieId: opts.movie,
          showtimeId: opts.showtime,
          seatCodes,
          customerName: opts.name,
        });
        console.log(formatConfirmation(confirmation, order));
      } catch (error) {
        fail(error);
      }
    });

  return program;
}
