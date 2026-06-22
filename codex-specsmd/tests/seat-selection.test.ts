import { describe, expect, it } from "vitest";

import { SeatSelectionError } from "../src/domain/errors.js";
import { normalizePurchaseRequest } from "../src/domain/purchase-request.js";
import { validateSeatSelection } from "../src/domain/seat-selection.js";
import { parseCatalog, parseCinemaState } from "../src/infrastructure/json-validation.js";
import { validCatalogInput, validStateInput } from "./fixtures/catalog-fixtures.js";

function request(seats: readonly string[]) {
  return normalizePurchaseRequest({
    customerName: "Ana",
    showtimeId: "showtime-1",
    seats
  });
}

describe("validateSeatSelection", () => {
  it("returns the complete normalized valid selection", () => {
    const result = validateSeatSelection(
      parseCatalog(validCatalogInput()),
      parseCinemaState(validStateInput()),
      request(["a1", "b1"])
    );

    expect(result.seats).toEqual(["A1", "B1"]);
    expect(result.showtime.id).toBe("showtime-1");
    expect(result.auditorium.id).toBe("auditorium-1");
  });

  it("reports every nonexistent and sold seat in one atomic failure", () => {
    const catalog = parseCatalog(validCatalogInput());
    const state = parseCinemaState(validStateInput());

    try {
      validateSeatSelection(catalog, state, request(["z9", "A2", "y8", "B1"]));
      throw new Error("Expected seat selection to fail");
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(SeatSelectionError);
      expect(error).toMatchObject({
        code: "INVALID_SEAT_SELECTION",
        nonexistentSeats: ["Z9", "Y8"],
        soldSeats: ["A2"]
      });
    }
  });

  it.each([
    [["Z9"], ["Z9"], []],
    [["A2"], [], ["A2"]]
  ])("reports one invalid category for seats %j", (seats, nonexistentSeats, soldSeats) => {
    expect(() =>
      validateSeatSelection(
        parseCatalog(validCatalogInput()),
        parseCinemaState(validStateInput()),
        request(seats)
      )
    ).toThrow(SeatSelectionError);

    try {
      validateSeatSelection(
        parseCatalog(validCatalogInput()),
        parseCinemaState(validStateInput()),
        request(seats)
      );
    } catch (error: unknown) {
      expect(error).toMatchObject({ nonexistentSeats, soldSeats });
    }
  });

  it("rejects unknown showtimes", () => {
    const unknown = normalizePurchaseRequest({
      customerName: "Ana",
      showtimeId: "missing",
      seats: ["A1"]
    });

    expect(() =>
      validateSeatSelection(
        parseCatalog(validCatalogInput()),
        parseCinemaState(validStateInput()),
        unknown
      )
    ).toThrow("Unknown showtime id: missing");
  });

  it("does not mutate request, catalog, or state when validation fails", () => {
    const catalog = parseCatalog(validCatalogInput());
    const state = parseCinemaState(validStateInput());
    const selected = request(["A1", "A2"]);
    const before = structuredClone({ catalog, state, selected });

    expect(() => validateSeatSelection(catalog, state, selected)).toThrow(SeatSelectionError);
    expect({ catalog, state, selected }).toEqual(before);
  });

  it("rejects an internally inconsistent catalog reference", () => {
    const catalog = parseCatalog(validCatalogInput());
    const inconsistent = {
      ...catalog,
      auditoriums: []
    };

    expect(() =>
      validateSeatSelection(inconsistent, parseCinemaState(validStateInput()), request(["A1"]))
    ).toThrow("references unknown auditorium");
  });
});
