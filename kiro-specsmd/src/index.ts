import { Command } from 'commander';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData } from './data/loader.js';
import { billboard } from './commands/billboard.js';
import { showtimes } from './commands/showtimes.js';
import { seats } from './commands/seats.js';
import { buy } from './commands/buy.js';

// Resolve data dir relative to project root (works from both src/ and dist/)
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

const program = new Command();

program
  .name('cinema')
  .description('Cinema ticket purchasing CLI')
  .version('1.0.0');

program
  .command('billboard')
  .description('Show all movies currently playing')
  .action(() => {
    const data = loadData(DATA_DIR);
    billboard(data);
  });

program
  .command('showtimes')
  .description('List showtimes for a movie')
  .requiredOption('--movie <id>', 'Movie ID')
  .action((opts) => {
    const data = loadData(DATA_DIR);
    showtimes({ movie: opts.movie }, data);
  });

program
  .command('seats')
  .description('Show seat availability for a showtime')
  .requiredOption('--showtime <id>', 'Showtime ID')
  .action((opts) => {
    const data = loadData(DATA_DIR);
    seats({ showtime: opts.showtime }, data);
  });

program
  .command('buy')
  .description('Purchase tickets for a showtime')
  .requiredOption('--showtime <id>', 'Showtime ID')
  .requiredOption('--seats <ids>', 'Comma-separated seat IDs')
  .requiredOption('--customer <name>', 'Customer name')
  .action((opts) => {
    const data = loadData(DATA_DIR);
    buy({ showtime: opts.showtime, seats: opts.seats, customer: opts.customer }, data, DATA_DIR);
  });

program.parse();
