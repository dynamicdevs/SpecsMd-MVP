import type { Auditorium, CinemaState, Movie, Showtime } from "./catalog-types.js";

export interface PurchaseRequestInput {
  readonly customerName: unknown;
  readonly showtimeId: unknown;
  readonly seats: unknown;
}

export interface PurchaseRequest {
  readonly customerName: string;
  readonly showtimeId: string;
  readonly seats: readonly string[];
}

export interface ValidatedSeatSelection {
  readonly showtime: Showtime;
  readonly auditorium: Auditorium;
  readonly seats: readonly string[];
}

export interface PriceSubtotal {
  readonly currency: "USD";
  readonly unitPrice: number;
  readonly subtotal: number;
}

export interface PricingBreakdown extends PriceSubtotal {
  readonly discount: number;
  readonly total: number;
  readonly isTuesdayDiscountApplied: boolean;
}

export interface PreparedPurchase {
  readonly customerName: string;
  readonly movie: Movie;
  readonly showtime: Showtime;
  readonly auditorium: Auditorium;
  readonly seats: readonly string[];
  readonly pricing: PricingBreakdown;
}

export interface PurchasePreparation {
  readonly purchase: PreparedPurchase;
  readonly priorState: CinemaState;
}

export interface PurchaseConfirmation {
  readonly confirmationId: string;
  readonly customerName: string;
  readonly movieId: string;
  readonly movieTitle: string;
  readonly showtimeId: string;
  readonly startsAt: string;
  readonly format: Showtime["format"];
  readonly auditoriumId: string;
  readonly auditoriumName: string;
  readonly seats: readonly string[];
  readonly currency: "USD";
  readonly unitPrice: number;
  readonly subtotal: number;
  readonly discount: number;
  readonly total: number;
}

export type PurchaseRecord = PurchaseConfirmation;

export interface PurchaseCompletion {
  readonly confirmation: PurchaseConfirmation;
  readonly nextState: CinemaState;
}
