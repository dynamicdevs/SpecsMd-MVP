import { describe, expect, it } from "vitest";

import { CinemaCatalogService, listMovies, listShowtimes } from "../src/application/catalog-queries.js";
import type { CatalogRepository, StateReader } from "../src/application/ports.js";
import { projectSeatAvailability } from "../src/domain/seat-availability.js";
import { parseCatalog, parseCinemaState } from "../src/infrastructure/json-validation.js";
import { validCatalogInput, validStateInput } from "./fixtures/catalog-fixtures.js";

describe("catalog queries", () => {
  it("lists movies in fixture order without adding absent classification", () => {
    const catalog = parseCatalog(validCatalogInput());

    const result = listMovies(catalog);

    expect(result.map((movie) => movie.id)).toEqual(["movie-1", "movie-2", "movie-empty"]);
    expect(result[1]).not.toHaveProperty("classification");
    expect(result).not.toBe(catalog.movies);
  });

  it("returns an explicit empty movie collection", () => {
    expect(listMovies(parseCatalog({ movies: [], auditoriums: [], showtimes: [] }))).toEqual([]);
  });

  it("lists a known movie's showtimes in fixture order with auditorium names", () => {
    const result = listShowtimes(parseCatalog(validCatalogInput()), " movie-1 ");

    expect(result.map((showtime) => showtime.id)).toEqual(["showtime-1", "showtime-2"]);
    expect(result[0]).toMatchObject({ format: "IMAX", auditoriumName: "Hall 1" });
  });

  it("distinguishes an unknown movie from a movie with no showtimes", () => {
    const catalog = parseCatalog(validCatalogInput());

    expect(listShowtimes(catalog, "movie-empty")).toEqual([]);
    expect(() => listShowtimes(catalog, "missing")).toThrow("Unknown movie id: missing");
  });

  it("projects seats in layout order with persisted sold status", () => {
    const catalog = parseCatalog(validCatalogInput());
    const state = parseCinemaState(validStateInput());

    expect(projectSeatAvailability(catalog, state, "showtime-1")).toEqual([
      { seatId: "A1", status: "available" },
      { seatId: "A2", status: "sold" },
      { seatId: "B1", status: "available" }
    ]);
  });

  it("returns all seats available when state has no entry", () => {
    const catalog = parseCatalog(validCatalogInput());
    const state = parseCinemaState({ ...validStateInput(), soldSeats: {} });

    expect(projectSeatAvailability(catalog, state, "showtime-1")).toEqual([
      { seatId: "A1", status: "available" },
      { seatId: "A2", status: "available" },
      { seatId: "B1", status: "available" }
    ]);
  });

  it("rejects unknown showtimes and state that references unknown seats", () => {
    const catalog = parseCatalog(validCatalogInput());
    const validState = parseCinemaState(validStateInput());
    const invalidState = parseCinemaState({
      ...validStateInput(),
      soldSeats: { "showtime-1": ["Z9"] }
    });

    expect(() => projectSeatAvailability(catalog, validState, "missing")).toThrow(
      "Unknown showtime id: missing"
    );
    expect(() => projectSeatAvailability(catalog, invalidState, "showtime-1")).toThrow(
      "references unknown seats: Z9"
    );
  });

  it("loads dependencies through the application service", async () => {
    const catalog = parseCatalog(validCatalogInput());
    const state = parseCinemaState(validStateInput());
    const catalogRepository: CatalogRepository = { load: async () => catalog };
    const stateReader: StateReader = { load: async () => state };
    const service = new CinemaCatalogService(catalogRepository, stateReader);

    await expect(service.listMovies()).resolves.toHaveLength(3);
    await expect(service.listShowtimes("movie-1")).resolves.toHaveLength(2);
    await expect(service.getSeatAvailability(" showtime-1 ")).resolves.toContainEqual({
      seatId: "A2",
      status: "sold"
    });
  });
});
