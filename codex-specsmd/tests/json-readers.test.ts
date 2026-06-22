import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { JsonCatalogRepository } from "../src/infrastructure/json-catalog-repository.js";
import { JsonStateReader } from "../src/infrastructure/json-state-reader.js";
import { validCatalogInput, validStateInput } from "./fixtures/catalog-fixtures.js";

describe("JSON readers", () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "codex-cinema-"));
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("reads and validates a catalog from an injected path", async () => {
    const path = join(directory, "catalog.json");
    await writeFile(path, JSON.stringify(validCatalogInput()), "utf8");

    const catalog = await new JsonCatalogRepository(path).load();

    expect(catalog.movies).toHaveLength(3);
    expect(catalog.movies[0]).toMatchObject({ id: "movie-1", title: "First Movie" });
  });

  it("maps missing and malformed catalog files to typed errors", async () => {
    const missingPath = join(directory, "missing.json");
    await expect(new JsonCatalogRepository(missingPath).load()).rejects.toMatchObject({
      code: "CATALOG_READ_ERROR"
    });

    const malformedPath = join(directory, "malformed.json");
    await writeFile(malformedPath, "{", "utf8");
    await expect(new JsonCatalogRepository(malformedPath).load()).rejects.toMatchObject({
      code: "INVALID_CATALOG_DATA"
    });
  });

  it("rereads sold-seat state from the same path across invocations", async () => {
    const path = join(directory, "state.json");
    const reader = new JsonStateReader(path);
    await writeFile(path, JSON.stringify(validStateInput()), "utf8");
    await expect(reader.load()).resolves.toMatchObject({
      soldSeats: { "showtime-1": ["A2"] }
    });

    await writeFile(
      path,
      JSON.stringify({ ...validStateInput(), soldSeats: { "showtime-1": ["A1", "B1"] } }),
      "utf8"
    );
    await expect(reader.load()).resolves.toMatchObject({
      soldSeats: { "showtime-1": ["A1", "B1"] }
    });
  });

  it("maps missing and malformed state files to typed errors", async () => {
    const missingPath = join(directory, "missing-state.json");
    await expect(new JsonStateReader(missingPath).load()).rejects.toMatchObject({
      code: "STATE_READ_ERROR"
    });

    const malformedPath = join(directory, "malformed-state.json");
    await writeFile(malformedPath, "not-json", "utf8");
    await expect(new JsonStateReader(malformedPath).load()).rejects.toMatchObject({
      code: "INVALID_STATE_DATA"
    });
  });
});
