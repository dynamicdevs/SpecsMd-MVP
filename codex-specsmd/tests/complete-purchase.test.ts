import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { PurchaseCompletionService } from "../src/application/complete-purchase.js";
import type { StateRepository } from "../src/application/ports.js";
import { parseCatalog } from "../src/infrastructure/json-validation.js";
import { JsonStateRepository } from "../src/infrastructure/json-state-repository.js";
import { validCatalogInput, validStateInput } from "./fixtures/catalog-fixtures.js";

describe("PurchaseCompletionService", () => {
  let directory: string;
  let statePath: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "codex-completion-"));
    statePath = join(directory, "state.json");
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("persists successive purchases and reloads unchanged confirmations", async () => {
    const catalog = parseCatalog(validCatalogInput());
    const repository = new JsonStateRepository(statePath);
    const service = new PurchaseCompletionService(
      { load: async () => catalog },
      repository
    );

    const first = await service.complete({
      customerName: "Ana",
      showtimeId: "showtime-1",
      seats: ["A1"]
    });
    const second = await service.complete({
      customerName: "Beto",
      showtimeId: "showtime-1",
      seats: ["B1"]
    });
    const reloaded = await repository.load();

    expect(first.confirmationId).toBe("CIN-000001");
    expect(second.confirmationId).toBe("CIN-000002");
    expect(reloaded.purchases).toEqual([first, second]);
    expect(reloaded.soldSeats["showtime-1"]).toEqual(["A1", "B1"]);
    expect(reloaded.nextConfirmationSequence).toBe(3);
  });

  it("does not create a state file for a rejected purchase", async () => {
    const catalog = parseCatalog(validCatalogInput());
    const initial = validStateInput();
    initial["soldSeats"] = { "showtime-1": ["A2"] };
    const repository: StateRepository = {
      load: async () => {
        const { parseCinemaState } = await import("../src/infrastructure/json-validation.js");
        return parseCinemaState(initial);
      },
      save: async () => {
        throw new Error("save must not be called");
      }
    };
    const service = new PurchaseCompletionService(
      { load: async () => catalog },
      repository
    );

    await expect(
      service.complete({ customerName: "Ana", showtimeId: "showtime-1", seats: ["A2"] })
    ).rejects.toMatchObject({ code: "INVALID_SEAT_SELECTION" });
  });

  it("does not return success and preserves existing bytes when saving fails", async () => {
    const catalog = parseCatalog(validCatalogInput());
    const prior = `${JSON.stringify(
      {
        version: 1,
        nextConfirmationSequence: 1,
        soldSeats: {},
        purchases: []
      },
      null,
      2
    )}\n`;
    const { writeFile } = await import("node:fs/promises");
    await writeFile(statePath, prior, "utf8");
    const real = new JsonStateRepository(statePath);
    const failing: StateRepository = {
      load: () => real.load(),
      save: async () => {
        throw new Error("injected persistence failure");
      }
    };
    const service = new PurchaseCompletionService(
      { load: async () => catalog },
      failing
    );

    await expect(
      service.complete({ customerName: "Ana", showtimeId: "showtime-1", seats: ["A1"] })
    ).rejects.toThrow("injected persistence failure");
    expect(await readFile(statePath, "utf8")).toBe(prior);
  });
});
