/**
 * Domain types for the cinema ticket purchasing system.
 * All money values are in centavos (integers).
 */

export type ScreenFormat = '2D' | '3D' | 'IMAX';

export type SeatStatus = 'free' | 'sold';

export interface Movie {
  id: string;
  title: string;
  formats: ScreenFormat[];
}

export interface Showtime {
  id: string;
  movieId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // HH:MM
  format: ScreenFormat;
  room: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
}

export interface PurchaseInput {
  customer: string;
  showtimeId: string;
  movieTitle: string;
  showtimeDate: string;
  showtimeTime: string;
  format: ScreenFormat;
  seats: string[];
  subtotal: number;
  discountApplied: boolean;
  discountAmount: number;
  total: number;
}

export interface Confirmation {
  confirmationId: string;
  customer: string;
  movieTitle: string;
  showtimeDate: string;
  showtimeTime: string;
  format: ScreenFormat;
  seats: string[];
  subtotal: number;
  discountApplied: boolean;
  discountAmount: number;
  total: number;
}

export type ValidationResult =
  | { valid: true; seats: Seat[] }
  | { valid: false; error: string };

export interface DiscountResult {
  total: number;
  discountApplied: boolean;
  discountAmount: number;
}
