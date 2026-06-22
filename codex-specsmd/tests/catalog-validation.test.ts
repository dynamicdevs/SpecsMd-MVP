import { describe, expect, it } from "vitest";

import { ApplicationError } from "../src/domain/errors.js";
import { parseCatalog, parseCinemaState } from "../src/infrastructure/json-validation.js";
import { validCatalogInput, validStateInput } from "./fixtures/catalog-fixtures.js";

function expectCode(action: () => unknown, code: ApplicationError["code"]): void {
  expect(action).toThrowError(ApplicationError);
  try {
    action();
  } catch (error: unknown) {
    expect(error).toMatchObject({ code });
  }
}

describe("parseCatalog", () => {
  it("validates values, preserves fixture order, and normalizes seats", () => {
    const catalog = parseCatalog(validCatalogInput());

    expect(catalog.movies.map((movie) => movie.id)).toEqual([
      "movie-1",
      "movie-2",
      "movie-empty"
    ]);
    expect(catalog.movies[1]).toEqual({ id: "movie-2", title: "Second Movie" });
    expect(catalog.auditoriums[0]?.seats).toEqual(["A1", "A2", "B1"]);
    expect(catalog.showtimes.map((showtime) => showtime.format)).toEqual([
      "IMAX",
      "3D",
      "2D"
    ]);
  });

  it("accepts an explicit empty catalog", () => {
    expect(parseCatalog({ movies: [], auditoriums: [], showtimes: [] })).toEqual({
      movies: [],
      auditoriums: [],
      showtimes: []
    });
  });

  it.each([
    [null, "catalog must be an object"],
    [{ movies: {}, auditoriums: [], showtimes: [] }, "movies must be an array"],
    [
      { movies: [{ id: "", title: "Movie" }], auditoriums: [], showtimes: [] },
      "movies[0].id must be a non-empty string"
    ],
    [
      { movies: [{ id: "m", title: 1 }], auditoriums: [], showtimes: [] },
      "movies[0].title must be a non-empty string"
    ],
    [
      { movies: [{ id: "m", title: "Movie", classification: "" }], auditoriums: [], showtimes: [] },
      "movies[0].classification must be a non-empty string"
    ]
  ])("rejects invalid catalog shape %#", (input, message) => {
    expect(() => parseCatalog(input)).toThrow(message);
  });

  it.each(["movies", "auditoriums", "showtimes"])("rejects duplicate %s IDs", (section) => {
    const input = validCatalogInput();
    const values = input[section];
    if (!Array.isArray(values)) {
      throw new Error("Fixture invariant failed");
    }
    values.push(structuredClone(values[0]));

    expectCode(() => parseCatalog(input), "INVALID_CATALOG_DATA");
  });

  it("rejects duplicate normalized seat labels", () => {
    const input = validCatalogInput();
    input["auditoriums"] = [{ id: "aud", name: "Hall", seats: ["a1", "A1"] }];
    input["showtimes"] = [];

    expect(() => parseCatalog(input)).toThrow("duplicate normalized labels");
  });

  it.each(["4D", "", 2])("rejects unsupported format %j", (format) => {
    const input = validCatalogInput();
    const showtimes = input["showtimes"];
    if (!Array.isArray(showtimes) || typeof showtimes[0] !== "object" || showtimes[0] === null) {
      throw new Error("Fixture invariant failed");
    }
    (showtimes[0] as Record<string, unknown>)["format"] = format;

    expect(() => parseCatalog(input)).toThrow("must be one of 2D, 3D, or IMAX");
  });

  it.each(["not-a-date", "2026-06-23"])("rejects invalid UTC showtime %s", (startsAt) => {
    const input = validCatalogInput();
    const showtimes = input["showtimes"] as Record<string, unknown>[];
    if (showtimes[0] === undefined) {
      throw new Error("Fixture invariant failed");
    }
    showtimes[0]["startsAt"] = startsAt;

    expect(() => parseCatalog(input)).toThrow("ISO-8601 UTC timestamp");
  });

  it("rejects showtimes that reference unknown movies or auditoriums", () => {
    const unknownMovie = validCatalogInput();
    const movieShowtimes = unknownMovie["showtimes"] as Record<string, unknown>[];
    if (movieShowtimes[0] === undefined) throw new Error("Fixture invariant failed");
    movieShowtimes[0]["movieId"] = "missing";
    expect(() => parseCatalog(unknownMovie)).toThrow("unknown movie");

    const unknownAuditorium = validCatalogInput();
    const auditoriumShowtimes = unknownAuditorium["showtimes"] as Record<string, unknown>[];
    if (auditoriumShowtimes[0] === undefined) throw new Error("Fixture invariant failed");
    auditoriumShowtimes[0]["auditoriumId"] = "missing";
    expect(() => parseCatalog(unknownAuditorium)).toThrow("unknown auditorium");
  });
});

describe("parseCinemaState", () => {
  it("normalizes sold seats and preserves state values", () => {
    expect(parseCinemaState(validStateInput())).toEqual({
      version: 1,
      nextConfirmationSequence: 2,
      soldSeats: { "showtime-1": ["A2"] },
      purchases: []
    });
  });

  it.each([
    [null, "state must be an object"],
    [{ ...validStateInput(), version: 2 }, "state.version must equal 1"],
    [
      { ...validStateInput(), nextConfirmationSequence: 0 },
      "must be a positive safe integer"
    ],
    [{ ...validStateInput(), purchases: {} }, "state.purchases must be an array"],
    [{ ...validStateInput(), soldSeats: [] }, "state.soldSeats must be an object"]
  ])("rejects invalid state shape %#", (input, message) => {
    expect(() => parseCinemaState(input)).toThrow(message);
  });

  it("rejects invalid and duplicate sold seats", () => {
    expect(() =>
      parseCinemaState({ ...validStateInput(), soldSeats: { "showtime-1": [1] } })
    ).toThrow("must be a non-empty string");
    expect(() =>
      parseCinemaState({ ...validStateInput(), soldSeats: { "showtime-1": ["a1", "A1"] } })
    ).toThrow("contains duplicate seats");
  });
});
