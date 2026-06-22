/**
 * Pure domain types for the cinema ticket-purchasing flow.
 *
 * This module is data-only: no I/O, no framework imports, no `console`.
 * Monetary amounts are represented as integer cents (see {@link Cents}) to
 * avoid floating-point currency drift.
 */

/** Screening format. Pricing surcharges are keyed off this. */
export type Format = '2D' | '3D' | 'IMAX';

/** Availability of a single seat within a showtime. */
export type SeatStatus = 'available' | 'sold';

/** Monetary amount in integer cents (e.g. $10.00 === 1000). */
export type Cents = number;

/** A film shown on the billboard. */
export interface Movie {
  id: string;
  title: string;
  formats: Format[];
}

/** A single seat in a showtime's layout, identified by a code like `B4`. */
export interface Seat {
  code: string;
  status: SeatStatus;
}

/** A scheduled screening of a movie in a given format. */
export interface Showtime {
  id: string;
  movieId: string;
  /** ISO 8601 date/time string; weekday for the Tuesday rule is derived from this. */
  startsAt: string;
  format: Format;
  screen: string;
  seats: Seat[];
}

/** A priced selection of seats for a single showtime. */
export interface Order {
  showtime: Showtime;
  /** Normalized seat codes included in the order. */
  seatCodes: string[];
  subtotalCents: Cents;
  discountCents: Cents;
  totalCents: Cents;
}

/** The result of a successful purchase. */
export interface Confirmation {
  confirmationId: string;
  movieTitle: string;
  showtime: Showtime;
  seatCodes: string[];
  customerName: string;
  totalCents: Cents;
}
