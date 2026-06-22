import {
  PRESENTATION_FORMATS,
  type Auditorium,
  type Catalog,
  type CinemaState,
  type Movie,
  type PresentationFormat,
  type Showtime
} from "../domain/catalog-types.js";
import { invalidCatalog, invalidState } from "../domain/errors.js";
import type { PurchaseRecord } from "../domain/purchase-types.js";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredObject(value: unknown, path: string, kind: "catalog" | "state"): JsonObject {
  if (!isObject(value)) {
    throw kind === "catalog"
      ? invalidCatalog(`${path} must be an object.`)
      : invalidState(`${path} must be an object.`);
  }
  return value;
}

function requiredArray(value: unknown, path: string, kind: "catalog" | "state"): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw kind === "catalog"
      ? invalidCatalog(`${path} must be an array.`)
      : invalidState(`${path} must be an array.`);
  }
  return value;
}

function requiredString(value: unknown, path: string, kind: "catalog" | "state"): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw kind === "catalog"
      ? invalidCatalog(`${path} must be a non-empty string.`)
      : invalidState(`${path} must be a non-empty string.`);
  }
  return value.trim();
}

function assertUnique(values: readonly string[], path: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw invalidCatalog(`${path} contains duplicate id '${value}'.`);
    }
    seen.add(value);
  }
}

function parseMovie(value: unknown, index: number): Movie {
  const item = requiredObject(value, `movies[${index}]`, "catalog");
  const id = requiredString(item["id"], `movies[${index}].id`, "catalog");
  const title = requiredString(item["title"], `movies[${index}].title`, "catalog");
  if (item["classification"] === undefined) {
    return { id, title };
  }
  return {
    id,
    title,
    classification: requiredString(
      item["classification"],
      `movies[${index}].classification`,
      "catalog"
    )
  };
}

function parseAuditorium(value: unknown, index: number): Auditorium {
  const item = requiredObject(value, `auditoriums[${index}]`, "catalog");
  const seats = requiredArray(item["seats"], `auditoriums[${index}].seats`, "catalog").map(
    (seat, seatIndex) =>
      requiredString(seat, `auditoriums[${index}].seats[${seatIndex}]`, "catalog").toUpperCase()
  );
  const uniqueSeats = new Set(seats);
  if (uniqueSeats.size !== seats.length) {
    throw invalidCatalog(`auditoriums[${index}].seats contains duplicate normalized labels.`);
  }
  return {
    id: requiredString(item["id"], `auditoriums[${index}].id`, "catalog"),
    name: requiredString(item["name"], `auditoriums[${index}].name`, "catalog"),
    seats
  };
}

function parseFormat(value: unknown, path: string): PresentationFormat {
  if (typeof value !== "string" || !PRESENTATION_FORMATS.includes(value as PresentationFormat)) {
    throw invalidCatalog(`${path} must be one of 2D, 3D, or IMAX.`);
  }
  return value as PresentationFormat;
}

function parseShowtime(value: unknown, index: number): Showtime {
  const item = requiredObject(value, `showtimes[${index}]`, "catalog");
  const startsAt = requiredString(item["startsAt"], `showtimes[${index}].startsAt`, "catalog");
  const isoUtc = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u;
  if (!isoUtc.test(startsAt) || Number.isNaN(Date.parse(startsAt))) {
    throw invalidCatalog(`showtimes[${index}].startsAt must be an ISO-8601 UTC timestamp.`);
  }
  return {
    id: requiredString(item["id"], `showtimes[${index}].id`, "catalog"),
    movieId: requiredString(item["movieId"], `showtimes[${index}].movieId`, "catalog"),
    startsAt,
    auditoriumId: requiredString(
      item["auditoriumId"],
      `showtimes[${index}].auditoriumId`,
      "catalog"
    ),
    format: parseFormat(item["format"], `showtimes[${index}].format`)
  };
}

function nonNegativeMoney(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw invalidState(`${path} must be a non-negative safe integer.`);
  }
  return value;
}

function parsePurchaseRecord(value: unknown, index: number): PurchaseRecord {
  const path = `state.purchases[${index}]`;
  const item = requiredObject(value, path, "state");
  const confirmationId = requiredString(item["confirmationId"], `${path}.confirmationId`, "state");
  if (!/^CIN-\d{6}$/u.test(confirmationId)) {
    throw invalidState(`${path}.confirmationId must match CIN- followed by six digits.`);
  }
  const startsAt = requiredString(item["startsAt"], `${path}.startsAt`, "state");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u.test(startsAt) || Number.isNaN(Date.parse(startsAt))) {
    throw invalidState(`${path}.startsAt must be an ISO-8601 UTC timestamp.`);
  }
  const formatValue = item["format"];
  if (
    typeof formatValue !== "string" ||
    !PRESENTATION_FORMATS.includes(formatValue as PresentationFormat)
  ) {
    throw invalidState(`${path}.format must be one of 2D, 3D, or IMAX.`);
  }
  const seats = requiredArray(item["seats"], `${path}.seats`, "state").map((seat, seatIndex) =>
    requiredString(seat, `${path}.seats[${seatIndex}]`, "state").toUpperCase()
  );
  if (seats.length === 0) {
    throw invalidState(`${path}.seats must contain at least one seat.`);
  }
  if (new Set(seats).size !== seats.length) {
    throw invalidState(`${path}.seats contains duplicate normalized labels.`);
  }

  const unitPrice = nonNegativeMoney(item["unitPrice"], `${path}.unitPrice`);
  const subtotal = nonNegativeMoney(item["subtotal"], `${path}.subtotal`);
  const discount = nonNegativeMoney(item["discount"], `${path}.discount`);
  const total = nonNegativeMoney(item["total"], `${path}.total`);
  if (discount > subtotal || total !== subtotal - discount) {
    throw invalidState(`${path} contains inconsistent subtotal, discount, and total values.`);
  }

  const currency = requiredString(item["currency"], `${path}.currency`, "state");
  if (currency !== "USD") {
    throw invalidState(`${path}.currency must equal USD.`);
  }

  return {
    confirmationId,
    customerName: requiredString(item["customerName"], `${path}.customerName`, "state"),
    movieId: requiredString(item["movieId"], `${path}.movieId`, "state"),
    movieTitle: requiredString(item["movieTitle"], `${path}.movieTitle`, "state"),
    showtimeId: requiredString(item["showtimeId"], `${path}.showtimeId`, "state"),
    startsAt,
    format: formatValue as PresentationFormat,
    auditoriumId: requiredString(item["auditoriumId"], `${path}.auditoriumId`, "state"),
    auditoriumName: requiredString(
      item["auditoriumName"],
      `${path}.auditoriumName`,
      "state"
    ),
    seats,
    currency: "USD",
    unitPrice,
    subtotal,
    discount,
    total
  };
}

export function parseCatalog(value: unknown): Catalog {
  const root = requiredObject(value, "catalog", "catalog");
  const movies = requiredArray(root["movies"], "movies", "catalog").map(parseMovie);
  const auditoriums = requiredArray(root["auditoriums"], "auditoriums", "catalog").map(
    parseAuditorium
  );
  const showtimes = requiredArray(root["showtimes"], "showtimes", "catalog").map(parseShowtime);

  assertUnique(
    movies.map((movie) => movie.id),
    "movies"
  );
  assertUnique(
    auditoriums.map((auditorium) => auditorium.id),
    "auditoriums"
  );
  assertUnique(
    showtimes.map((showtime) => showtime.id),
    "showtimes"
  );

  const movieIds = new Set(movies.map((movie) => movie.id));
  const auditoriumIds = new Set(auditoriums.map((auditorium) => auditorium.id));
  for (const showtime of showtimes) {
    if (!movieIds.has(showtime.movieId)) {
      throw invalidCatalog(`Showtime '${showtime.id}' references unknown movie '${showtime.movieId}'.`);
    }
    if (!auditoriumIds.has(showtime.auditoriumId)) {
      throw invalidCatalog(
        `Showtime '${showtime.id}' references unknown auditorium '${showtime.auditoriumId}'.`
      );
    }
  }

  return { movies, auditoriums, showtimes };
}

export function parseCinemaState(value: unknown): CinemaState {
  const root = requiredObject(value, "state", "state");
  if (root["version"] !== 1) {
    throw invalidState("state.version must equal 1.");
  }
  if (
    typeof root["nextConfirmationSequence"] !== "number" ||
    !Number.isSafeInteger(root["nextConfirmationSequence"]) ||
    root["nextConfirmationSequence"] < 1
  ) {
    throw invalidState("state.nextConfirmationSequence must be a positive safe integer.");
  }
  const purchases = requiredArray(root["purchases"], "state.purchases", "state").map(
    parsePurchaseRecord
  );
  const rawSoldSeats = requiredObject(root["soldSeats"], "state.soldSeats", "state");
  const soldSeats: Record<string, readonly string[]> = {};

  for (const [showtimeId, valueForShowtime] of Object.entries(rawSoldSeats)) {
    const normalizedShowtimeId = requiredString(showtimeId, "state.soldSeats key", "state");
    const seats = requiredArray(
      valueForShowtime,
      `state.soldSeats.${normalizedShowtimeId}`,
      "state"
    ).map((seat, index) =>
      requiredString(
        seat,
        `state.soldSeats.${normalizedShowtimeId}[${index}]`,
        "state"
      ).toUpperCase()
    );
    if (new Set(seats).size !== seats.length) {
      throw invalidState(`state.soldSeats.${normalizedShowtimeId} contains duplicate seats.`);
    }
    soldSeats[normalizedShowtimeId] = seats;
  }

  const confirmationIds = purchases.map((purchase) => purchase.confirmationId);
  if (new Set(confirmationIds).size !== confirmationIds.length) {
    throw invalidState("state.purchases contains duplicate confirmation ids.");
  }
  const highestSequence = confirmationIds.reduce((highest, id) => {
    const sequence = Number.parseInt(id.slice("CIN-".length), 10);
    return Math.max(highest, sequence);
  }, 0);
  if (root["nextConfirmationSequence"] <= highestSequence) {
    throw invalidState("state.nextConfirmationSequence must be greater than persisted ids.");
  }

  return {
    version: 1,
    nextConfirmationSequence: root["nextConfirmationSequence"],
    soldSeats,
    purchases
  };
}
