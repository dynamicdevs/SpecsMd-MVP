import type { Catalog, CinemaState } from "./catalog-types.js";
import { ApplicationError, SeatSelectionError, invalidCatalog } from "./errors.js";
import type { PurchaseRequest, ValidatedSeatSelection } from "./purchase-types.js";

export function validateSeatSelection(
  catalog: Catalog,
  state: CinemaState,
  request: PurchaseRequest
): ValidatedSeatSelection {
  const showtime = catalog.showtimes.find((candidate) => candidate.id === request.showtimeId);
  if (showtime === undefined) {
    throw new ApplicationError(
      "SHOWTIME_NOT_FOUND",
      `Unknown showtime id: ${request.showtimeId}`
    );
  }

  const auditorium = catalog.auditoriums.find(
    (candidate) => candidate.id === showtime.auditoriumId
  );
  if (auditorium === undefined) {
    throw invalidCatalog(
      `Showtime '${showtime.id}' references unknown auditorium '${showtime.auditoriumId}'.`
    );
  }

  const validSeats = new Set(auditorium.seats);
  const soldSeats = new Set(state.soldSeats[showtime.id] ?? []);
  const nonexistent = request.seats.filter((seat) => !validSeats.has(seat));
  const sold = request.seats.filter((seat) => validSeats.has(seat) && soldSeats.has(seat));

  if (nonexistent.length > 0 || sold.length > 0) {
    const reasons = [
      nonexistent.length > 0 ? `nonexistent: ${nonexistent.join(", ")}` : undefined,
      sold.length > 0 ? `sold: ${sold.join(", ")}` : undefined
    ].filter((reason): reason is string => reason !== undefined);
    throw new SeatSelectionError(
      `Invalid seat selection (${reasons.join("; ")}).`,
      nonexistent,
      sold
    );
  }

  return { showtime, auditorium, seats: [...request.seats] };
}
