import {
  applyTuesdayDiscount,
  generateConfirmation,
  normalizeSeatCode,
  priceSeats,
  validateSeatSelection,
  type Confirmation,
  type Order,
} from '../domain';
import type { Dataset } from '../data/loader';
import { UnknownMovieError, UnknownShowtimeError } from './errors';

export interface BuyInput {
  movieId: string;
  showtimeId: string;
  seatCodes: string[];
  customerName: string;
  /** Optional seed for the deterministic confirmation id. */
  seed?: string;
}

export interface BuyResult {
  confirmation: Confirmation;
  order: Order;
}

/**
 * Execute a purchase: resolve the movie/showtime, validate seats, price by
 * format, apply the Tuesday discount (from the showtime's date), and produce a
 * confirmation. Throws a typed error if anything is invalid; nothing is "booked"
 * unless the whole selection is valid (all-or-nothing).
 */
export function runBuy(dataset: Dataset, input: BuyInput): BuyResult {
  const movie = dataset.movies.find((m) => m.id === input.movieId);
  if (!movie) {
    throw new UnknownMovieError(input.movieId);
  }

  const showtime = dataset.showtimes.find(
    (s) => s.id === input.showtimeId && s.movieId === input.movieId,
  );
  if (!showtime) {
    throw new UnknownShowtimeError(input.showtimeId);
  }

  validateSeatSelection(showtime, input.seatCodes);

  const seatCodes = input.seatCodes.map(normalizeSeatCode);
  const subtotalCents = priceSeats(showtime.format, seatCodes.length);
  const { discountCents, totalCents } = applyTuesdayDiscount(
    subtotalCents,
    new Date(showtime.startsAt),
  );

  const order: Order = { showtime, seatCodes, subtotalCents, discountCents, totalCents };
  const confirmation = generateConfirmation(order, movie.title, input.customerName, input.seed ?? '');

  return { confirmation, order };
}
