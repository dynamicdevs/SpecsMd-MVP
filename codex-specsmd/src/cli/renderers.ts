import type {
  Movie,
  PurchaseConfirmation,
  SeatAvailability,
  ShowtimeDetails
} from "../domain/index.js";

function money(cents: number, currency: string): string {
  return `${currency} ${(cents / 100).toFixed(2)}`;
}

export function renderMovies(movies: readonly Movie[]): string {
  return movies
    .map((movie) =>
      [movie.id, movie.title, movie.classification ?? "unrated"].join(" | ")
    )
    .join("\n");
}

export function renderShowtimes(showtimes: readonly ShowtimeDetails[]): string {
  return showtimes
    .map((showtime) =>
      [
        showtime.id,
        showtime.startsAt,
        showtime.format,
        showtime.auditoriumName
      ].join(" | ")
    )
    .join("\n");
}

export function renderSeats(seats: readonly SeatAvailability[]): string {
  return seats.map((seat) => `${seat.seatId} | ${seat.status}`).join("\n");
}

export function renderConfirmation(confirmation: PurchaseConfirmation): string {
  return [
    `Confirmation: ${confirmation.confirmationId}`,
    `Customer: ${confirmation.customerName}`,
    `Movie: ${confirmation.movieTitle} (${confirmation.movieId})`,
    `Showtime: ${confirmation.showtimeId}`,
    `Starts at: ${confirmation.startsAt}`,
    `Format: ${confirmation.format}`,
    `Auditorium: ${confirmation.auditoriumName} (${confirmation.auditoriumId})`,
    `Seats: ${confirmation.seats.join(", ")}`,
    `Unit price: ${money(confirmation.unitPrice, confirmation.currency)}`,
    `Subtotal: ${money(confirmation.subtotal, confirmation.currency)}`,
    `Discount: ${money(confirmation.discount, confirmation.currency)}`,
    `Total: ${money(confirmation.total, confirmation.currency)}`
  ].join("\n");
}
