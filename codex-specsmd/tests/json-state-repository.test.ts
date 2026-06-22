import {
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CinemaState } from "../src/domain/catalog-types.js";
import {
  EMPTY_CINEMA_STATE,
  JsonStateRepository,
  type StateFileOperations
} from "../src/infrastructure/json-state-repository.js";

const confirmation = {
  confirmationId: "CIN-000001",
  customerName: "Ana",
  movieId: "movie-1",
  movieTitle: "First Movie",
  showtimeId: "showtime-1",
  startsAt: "2026-06-23T19:00:00Z",
  format: "IMAX" as const,
  auditoriumId: "auditorium-1",
  auditoriumName: "Hall 1",
  seats: ["A1"],
  currency: "USD" as const,
  unitPrice: 1500,
  subtotal: 1500,
  discount: 300,
  total: 1200
};

const completedState: CinemaState = {
  version: 1,
  nextConfirmationSequence: 2,
  soldSeats: { "showtime-1": ["A1"] },
  purchases: [confirmation]
};

const actualOperations: StateFileOperations = {
  readFile: async (path) => readFile(path, "utf8"),
  writeFile: async (path, data) => writeFile(path, data, "utf8"),
  rename,
  remove: async (path) => rm(path, { force: true })
};

describe("JsonStateRepository", () => {
  let directory: string;
  let statePath: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "codex-state-"));
    statePath = join(directory, "state.json");
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("initializes a missing state file as a fresh independent value", async () => {
    const repository = new JsonStateRepository(statePath);

    const first = await repository.load();
    const second = await repository.load();

    expect(first).toEqual(EMPTY_CINEMA_STATE);
    expect(second).toEqual(EMPTY_CINEMA_STATE);
    expect(first).not.toBe(second);
  });

  it("replaces existing state and reloads the exact confirmation", async () => {
    await writeFile(statePath, `${JSON.stringify(EMPTY_CINEMA_STATE, null, 2)}\n`, "utf8");
    const repository = new JsonStateRepository(statePath);

    await repository.save(completedState);
    const reloaded = await repository.load();
    const bytes = await readFile(statePath, "utf8");

    expect(reloaded).toEqual(completedState);
    expect(reloaded.purchases[0]).toEqual(confirmation);
    expect(bytes.endsWith("\n")).toBe(true);
    expect(bytes).toBe(`${JSON.stringify(completedState, null, 2)}\n`);
  });

  it("rejects malformed existing state without overwriting it", async () => {
    const malformed = "{ definitely-not-valid";
    await writeFile(statePath, malformed, "utf8");
    const repository = new JsonStateRepository(statePath);

    await expect(repository.load()).rejects.toMatchObject({ code: "INVALID_STATE_DATA" });
    expect(await readFile(statePath, "utf8")).toBe(malformed);
  });

  it("preserves prior bytes when temporary writing fails", async () => {
    const prior = `${JSON.stringify(EMPTY_CINEMA_STATE, null, 2)}\n`;
    await writeFile(statePath, prior, "utf8");
    const operations: StateFileOperations = {
      ...actualOperations,
      writeFile: vi.fn().mockRejectedValue(new Error("disk full"))
    };
    const repository = new JsonStateRepository(statePath, operations);

    await expect(repository.save(completedState)).rejects.toMatchObject({
      code: "STATE_WRITE_ERROR"
    });
    expect(await readFile(statePath, "utf8")).toBe(prior);
  });

  it("preserves prior bytes and removes temporary output when rename fails", async () => {
    const prior = `${JSON.stringify(EMPTY_CINEMA_STATE, null, 2)}\n`;
    await writeFile(statePath, prior, "utf8");
    const operations: StateFileOperations = {
      ...actualOperations,
      rename: vi.fn().mockRejectedValue(new Error("rename denied"))
    };
    const repository = new JsonStateRepository(statePath, operations);

    await expect(repository.save(completedState)).rejects.toMatchObject({
      code: "STATE_WRITE_ERROR"
    });
    expect(await readFile(statePath, "utf8")).toBe(prior);
    await expect(readFile(`${statePath}.tmp`, "utf8")).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("preserves the original failure when best-effort cleanup also fails", async () => {
    const prior = `${JSON.stringify(EMPTY_CINEMA_STATE, null, 2)}\n`;
    await writeFile(statePath, prior, "utf8");
    let removeCalls = 0;
    const operations: StateFileOperations = {
      ...actualOperations,
      rename: vi.fn().mockRejectedValue(new Error("rename denied")),
      remove: async (path) => {
        removeCalls += 1;
        if (removeCalls > 1) throw new Error("cleanup denied");
        await rm(path, { force: true });
      }
    };

    await expect(new JsonStateRepository(statePath, operations).save(completedState)).rejects.toMatchObject({
      code: "STATE_WRITE_ERROR"
    });
    expect(await readFile(statePath, "utf8")).toBe(prior);
  });

  it("rejects an invalid next state before touching the target", async () => {
    const prior = `${JSON.stringify(EMPTY_CINEMA_STATE, null, 2)}\n`;
    await writeFile(statePath, prior, "utf8");
    const invalid = { ...completedState, nextConfirmationSequence: 1 } as CinemaState;

    await expect(new JsonStateRepository(statePath).save(invalid)).rejects.toMatchObject({
      code: "INVALID_STATE_DATA"
    });
    expect(await readFile(statePath, "utf8")).toBe(prior);
  });
});
