import type { Catalog, CinemaState, SeatAvailability } from "./catalog-types.js";
import { ApplicationError, invalidCatalog, invalidState } from "./errors.js";

export function projectSeatAvailability(
  catalog: Catalog,
  state: CinemaState,
  showtimeId: string
): readonly SeatAvailability[] {
  const showtime = catalog.showtimes.find((candidate) => candidate.id === showtimeId);
  if (showtime === undefined) {
    throw new ApplicationError("SHOWTIME_NOT_FOUND", `Unknown showtime id: ${showtimeId}`);
  }

  const auditorium = catalog.auditoriums.find(
    (candidate) => candidate.id === showtime.auditoriumId
  );
  if (auditorium === undefined) {
    throw invalidCatalog(
      `Showtime '${showtime.id}' references unknown auditorium '${showtime.auditoriumId}'.`
    );
  }

  const soldSeats = state.soldSeats[showtime.id] ?? [];
  const validSeats = new Set(auditorium.seats);
  const inconsistentSeats = soldSeats.filter((seat) => !validSeats.has(seat));
  if (inconsistentSeats.length > 0) {
    throw invalidState(
      `State for showtime '${showtime.id}' references unknown seats: ${inconsistentSeats.join(", ")}.`
    );
  }

  const soldSeatSet = new Set(soldSeats);
  return auditorium.seats.map((seatId) => ({
    seatId,
    status: soldSeatSet.has(seatId) ? "sold" : "available"
  }));
}
