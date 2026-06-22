import { DataStore } from '../data/loader.js';
import { savePurchaseWithShowtime } from '../data/persistence.js';
import {
  validateSeats,
  calculatePrice,
  applyDiscount,
  generateConfirmation,
  PurchaseInput,
} from '../domain/index.js';

export interface BuyOptions {
  showtime: string;
  seats: string;
  customer: string;
}

/**
 * Executes the full purchase flow:
 * validate → price → discount → confirm → persist
 */
export function buy(options: BuyOptions, data: DataStore, dataDir: string): void {
  const { showtime: showtimeId, seats: seatsStr, customer } = options;

  // Validate required arguments
  if (!showtimeId || !seatsStr || !customer) {
    console.error('Error: --showtime, --seats, and --customer options are required');
    console.error('Usage: cinema buy --showtime <id> --seats <s1,s2,...> --customer <name>');
    process.exitCode = 1;
    return;
  }

  // Find showtime
  const showtime = data.showtimes.find((s) => s.id === showtimeId);
  if (!showtime) {
    console.error(`Error: Showtime "${showtimeId}" not found`);
    process.exitCode = 1;
    return;
  }

  // Find movie
  const movie = data.movies.find((m) => m.id === showtime.movieId);
  if (!movie) {
    console.error(`Error: Movie for showtime "${showtimeId}" not found`);
    process.exitCode = 1;
    return;
  }

  // Get seats for this showtime
  const availableSeats = data.seats[showtimeId];
  if (!availableSeats) {
    console.error(`Error: No seat data for showtime "${showtimeId}"`);
    process.exitCode = 1;
    return;
  }

  // Parse seat IDs
  const seatIds = seatsStr.split(',').map((s) => s.trim());

  // Validate seats
  const validation = validateSeats(seatIds, availableSeats);
  if (!validation.valid) {
    console.error(`Error: ${validation.error}`);
    process.exitCode = 1;
    return;
  }

  // Calculate price
  const subtotal = calculatePrice(showtime.format, validation.seats.length);

  // Apply discount
  const discount = applyDiscount(subtotal, showtime.date);

  // Generate confirmation
  const purchaseInput: PurchaseInput = {
    customer,
    showtimeId,
    movieTitle: movie.title,
    showtimeDate: showtime.date,
    showtimeTime: showtime.time,
    format: showtime.format,
    seats: seatIds,
    subtotal,
    discountApplied: discount.discountApplied,
    discountAmount: discount.discountAmount,
    total: discount.total,
  };

  const confirmation = generateConfirmation(purchaseInput);

  // Persist
  savePurchaseWithShowtime(dataDir, confirmation, showtimeId);

  // Display confirmation
  console.log('\n🎫 Purchase Confirmation\n');
  console.log(`  ID:        ${confirmation.confirmationId}`);
  console.log(`  Customer:  ${confirmation.customer}`);
  console.log(`  Movie:     ${confirmation.movieTitle}`);
  console.log(`  Showtime:  ${confirmation.showtimeDate} ${confirmation.showtimeTime} (${confirmation.format})`);
  console.log(`  Seats:     ${confirmation.seats.join(', ')}`);
  console.log(`  Subtotal:  $${(confirmation.subtotal / 100).toFixed(2)}`);
  if (confirmation.discountApplied) {
    console.log(`  Discount:  -$${(confirmation.discountAmount / 100).toFixed(2)} (20% Tuesday)`);
  }
  console.log(`  Total:     $${(confirmation.total / 100).toFixed(2)}`);
  console.log('');
}
