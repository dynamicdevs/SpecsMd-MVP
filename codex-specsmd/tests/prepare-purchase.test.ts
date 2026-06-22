import { describe, expect, it, vi } from "vitest";

import { PurchasePreparationService } from "../src/application/prepare-purchase.js";
import type { CatalogRepository, StateReader } from "../src/application/ports.js";
import { parseCatalog, parseCinemaState } from "../src/infrastructure/json-validation.js";
import { validCatalogInput, validStateInput } from "./fixtures/catalog-fixtures.js";

describe("PurchasePreparationService", () => {
  it("fails invalid requests before reading catalog or state", async () => {
    const catalogRepository: CatalogRepository = { load: vi.fn() };
    const stateReader: StateReader = { load: vi.fn() };
    const service = new PurchasePreparationService(catalogRepository, stateReader);

    await expect(
      service.prepare({ customerName: " ", showtimeId: "showtime-1", seats: ["A1"] })
    ).rejects.toMatchObject({ code: "INVALID_PURCHASE_REQUEST" });
    expect(catalogRepository.load).not.toHaveBeenCalled();
    expect(stateReader.load).not.toHaveBeenCalled();
  });

  it("prepares a Tuesday IMAX purchase without mutating prior state", async () => {
    const catalog = parseCatalog(validCatalogInput());
    const state = parseCinemaState(validStateInput());
    const before = structuredClone(state);
    const service = new PurchasePreparationService(
      { load: async () => catalog },
      { load: async () => state }
    );

    const result = await service.prepare({
      customerName: " Ana ",
      showtimeId: "showtime-1",
      seats: ["a1", "b1"]
    });

    expect(result.purchase).toMatchObject({
      customerName: "Ana",
      movie: { id: "movie-1" },
      showtime: { id: "showtime-1", format: "IMAX" },
      auditorium: { id: "auditorium-1" },
      seats: ["A1", "B1"],
      pricing: {
        unitPrice: 1500,
        subtotal: 3000,
        discount: 600,
        total: 2400,
        isTuesdayDiscountApplied: true
      }
    });
    expect(result.priorState).toBe(state);
    expect(state).toEqual(before);
  });

  it("rejects mixed unavailable seats and preserves sequence, purchases, and sold seats", async () => {
    const catalog = parseCatalog(validCatalogInput());
    const state = parseCinemaState(validStateInput());
    const before = structuredClone(state);
    const service = new PurchasePreparationService(
      { load: async () => catalog },
      { load: async () => state }
    );

    await expect(
      service.prepare({
        customerName: "Ana",
        showtimeId: "showtime-1",
        seats: ["A2", "Z9"]
      })
    ).rejects.toMatchObject({
      nonexistentSeats: ["Z9"],
      soldSeats: ["A2"]
    });
    expect(state).toEqual(before);
  });

  it("rejects an inconsistent movie reference from an injected catalog", async () => {
    const catalog = parseCatalog(validCatalogInput());
    const inconsistent = { ...catalog, movies: [] };
    const service = new PurchasePreparationService(
      { load: async () => inconsistent },
      { load: async () => parseCinemaState(validStateInput()) }
    );

    await expect(
      service.prepare({ customerName: "Ana", showtimeId: "showtime-1", seats: ["A1"] })
    ).rejects.toThrow("Showtime references unknown movie");
  });
});
