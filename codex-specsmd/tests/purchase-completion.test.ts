import { describe, expect, it } from "vitest";

import { PurchasePreparationService } from "../src/application/prepare-purchase.js";
import {
  MAX_CONFIRMATION_SEQUENCE,
  completePreparedPurchase
} from "../src/domain/purchase-completion.js";
import type { PurchaseRequestInput } from "../src/domain/purchase-types.js";
import { parseCatalog, parseCinemaState } from "../src/infrastructure/json-validation.js";
import { validCatalogInput, validStateInput } from "./fixtures/catalog-fixtures.js";

async function prepare(input: PurchaseRequestInput, stateInput = validStateInput()) {
  const catalog = parseCatalog(validCatalogInput());
  const state = parseCinemaState(stateInput);
  return new PurchasePreparationService(
    { load: async () => catalog },
    { load: async () => state }
  ).prepare(input);
}

describe("completePreparedPurchase", () => {
  it("creates one complete confirmation and immutable next state", async () => {
    const preparation = await prepare({
      customerName: "Ana",
      showtimeId: "showtime-1",
      seats: ["B1", "A1"]
    });
    const before = structuredClone(preparation);

    const completion = completePreparedPurchase(preparation);

    expect(completion.confirmation).toEqual({
      confirmationId: "CIN-000002",
      customerName: "Ana",
      movieId: "movie-1",
      movieTitle: "First Movie",
      showtimeId: "showtime-1",
      startsAt: "2026-06-23T19:00:00Z",
      format: "IMAX",
      auditoriumId: "auditorium-1",
      auditoriumName: "Hall 1",
      seats: ["B1", "A1"],
      currency: "USD",
      unitPrice: 1500,
      subtotal: 3000,
      discount: 600,
      total: 2400
    });
    expect(completion.nextState.purchases.at(-1)).toEqual(completion.confirmation);
    expect(completion.nextState.soldSeats["showtime-1"]).toEqual(["A2", "B1", "A1"]);
    expect(completion.nextState.nextConfirmationSequence).toBe(3);
    expect(preparation).toEqual(before);
  });

  it("starts at CIN-000001 and increments monotonically across committed states", async () => {
    const firstPreparation = await prepare(
      { customerName: "Ana", showtimeId: "showtime-1", seats: ["A1"] },
      {
        ...validStateInput(),
        nextConfirmationSequence: 1,
        soldSeats: {},
        purchases: []
      }
    );
    const first = completePreparedPurchase(firstPreparation);
    expect(first.confirmation.confirmationId).toBe("CIN-000001");

    const secondPreparation = await prepare(
      { customerName: "Beto", showtimeId: "showtime-1", seats: ["B1"] },
      first.nextState as unknown as Record<string, unknown>
    );
    const second = completePreparedPurchase(secondPreparation);

    expect(second.confirmation.confirmationId).toBe("CIN-000002");
    expect(second.nextState.purchases.map((purchase) => purchase.confirmationId)).toEqual([
      "CIN-000001",
      "CIN-000002"
    ]);
    expect(second.nextState.nextConfirmationSequence).toBe(3);
  });

  it("rejects an exhausted confirmation sequence without mutation", async () => {
    const preparation = await prepare(
      { customerName: "Ana", showtimeId: "showtime-1", seats: ["A1"] },
      {
        ...validStateInput(),
        nextConfirmationSequence: MAX_CONFIRMATION_SEQUENCE + 1
      }
    );
    const before = structuredClone(preparation);

    expect(() => completePreparedPurchase(preparation)).toThrow(
      "Confirmation sequence is invalid or exhausted"
    );
    expect(preparation).toEqual(before);
  });
});
