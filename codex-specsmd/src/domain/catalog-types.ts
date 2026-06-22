export const PRESENTATION_FORMATS = ["2D", "3D", "IMAX"] as const;

import type { PurchaseRecord } from "./purchase-types.js";

export type PresentationFormat = (typeof PRESENTATION_FORMATS)[number];

export interface Movie {
  readonly id: string;
  readonly title: string;
  readonly classification?: string;
}

export interface Showtime {
  readonly id: string;
  readonly movieId: string;
  readonly startsAt: string;
  readonly auditoriumId: string;
  readonly format: PresentationFormat;
}

export interface Auditorium {
  readonly id: string;
  readonly name: string;
  readonly seats: readonly string[];
}

export interface Catalog {
  readonly movies: readonly Movie[];
  readonly showtimes: readonly Showtime[];
  readonly auditoriums: readonly Auditorium[];
}

export interface CinemaState {
  readonly version: 1;
  readonly nextConfirmationSequence: number;
  readonly soldSeats: Readonly<Record<string, readonly string[]>>;
  readonly purchases: readonly PurchaseRecord[];
}

export interface SeatAvailability {
  readonly seatId: string;
  readonly status: "available" | "sold";
}

export interface ShowtimeDetails extends Showtime {
  readonly auditoriumName: string;
}
