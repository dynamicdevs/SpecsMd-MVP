import { describe, expect, it } from "vitest";

import type { PurchaseConfirmation } from "../src/domain/purchase-types.js";
import { parseCinemaState } from "../src/infrastructure/json-validation.js";

const validPurchase: PurchaseConfirmation = {
  confirmationId: "CIN-000001",
  customerName: "Ana",
  movieId: "movie-1",
  movieTitle: "First Movie",
  showtimeId: "showtime-1",
  startsAt: "2026-06-23T19:00:00Z",
  format: "IMAX",
  auditoriumId: "auditorium-1",
  auditoriumName: "Hall 1",
  seats: ["A1"],
  currency: "USD",
  unitPrice: 1500,
  subtotal: 1500,
  discount: 300,
  total: 1200
};

function stateWith(purchase: unknown, overrides: Record<string, unknown> = {}) {
  return {
    version: 1,
    nextConfirmationSequence: 2,
    soldSeats: { "showtime-1": ["A1"] },
    purchases: [purchase],
    ...overrides
  };
}

describe("persisted purchase validation", () => {
  it("accepts and normalizes a complete persisted confirmation", () => {
    const parsed = parseCinemaState(
      stateWith({ ...validPurchase, seats: ["a1"] })
    );

    expect(parsed.purchases[0]).toEqual(validPurchase);
  });

  it.each([
    [{ ...validPurchase, confirmationId: "random" }, "confirmationId"],
    [{ ...validPurchase, startsAt: "not-a-date" }, "startsAt"],
    [{ ...validPurchase, format: "4D" }, "format"],
    [{ ...validPurchase, seats: [] }, "at least one seat"],
    [{ ...validPurchase, seats: ["a1", "A1"] }, "duplicate normalized"],
    [{ ...validPurchase, unitPrice: -1 }, "unitPrice"],
    [{ ...validPurchase, subtotal: 1.5 }, "subtotal"],
    [{ ...validPurchase, discount: -1 }, "discount"],
    [{ ...validPurchase, total: -1 }, "total"],
    [{ ...validPurchase, total: 1199 }, "inconsistent"],
    [{ ...validPurchase, currency: "EUR" }, "currency must equal USD"],
    [{ ...validPurchase, customerName: "" }, "customerName"],
    [{ ...validPurchase, seats: [1] }, "seats[0]"]
  ])("rejects malformed purchase %#", (purchase, message) => {
    expect(() => parseCinemaState(stateWith(purchase))).toThrow(message);
  });

  it("rejects duplicate confirmation IDs and non-advanced sequence", () => {
    expect(() =>
      parseCinemaState({
        ...stateWith(validPurchase),
        purchases: [validPurchase, validPurchase],
        nextConfirmationSequence: 3
      })
    ).toThrow("duplicate confirmation ids");

    expect(() => parseCinemaState(stateWith(validPurchase, { nextConfirmationSequence: 1 }))).toThrow(
      "must be greater than persisted ids"
    );
  });
});
