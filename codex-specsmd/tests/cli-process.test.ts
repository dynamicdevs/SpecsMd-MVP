import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { validCatalogInput } from "./fixtures/catalog-fixtures.js";

const execute = promisify(execFile);
const projectRoot = resolve(fileURLToPath(new URL("../", import.meta.url)));

describe("CLI process integration", () => {
  let directory: string;
  let catalogPath: string;
  let statePath: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "codex-cli-"));
    catalogPath = join(directory, "catalog.json");
    statePath = join(directory, "state.json");
    await writeFile(catalogPath, JSON.stringify(validCatalogInput()), "utf8");
    await writeFile(statePath, JSON.stringify({
      version: 1,
      nextConfirmationSequence: 1,
      soldSeats: {},
      purchases: []
    }), "utf8");
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  async function run(args: readonly string[]) {
    return execute(
      process.execPath,
      ["--import", "tsx", "src/cli/main.ts", ...args],
      {
        cwd: projectRoot,
        env: {
          ...process.env,
          CINEMA_CATALOG_PATH: catalogPath,
          CINEMA_STATE_PATH: statePath
        }
      }
    );
  }

  it("completes and persists a deterministic purchase across processes", async () => {
    const purchase = await run([
      "buy", "--name", "Ada", "--showtime", "showtime-1", "--seats", "A1,B1"
    ]);
    expect(purchase.stderr).toBe("");
    expect(purchase.stdout).toContain("Confirmation: CIN-000001");
    expect(purchase.stdout).toContain("Total: USD 24.00");

    const seats = await run(["seats", "showtime-1"]);
    expect(seats.stdout).toContain("A1 | sold");
    expect(seats.stdout).toContain("B1 | sold");

    const state = JSON.parse(await readFile(statePath, "utf8")) as {
      purchases: Array<{ confirmationId: string }>;
      soldSeats: Record<string, string[]>;
    };
    expect(state.purchases[0]?.confirmationId).toBe("CIN-000001");
    expect(state.soldSeats["showtime-1"]).toEqual(["A1", "B1"]);
  });

  it("rejects a sold seat with stable stderr and exit code", async () => {
    await run(["buy", "--name", "Ada", "--showtime", "showtime-1", "--seats", "A1"]);
    await expect(run([
      "buy", "--name", "Grace", "--showtime", "showtime-1", "--seats", "A1"
    ])).rejects.toMatchObject({
      code: 2,
      stdout: "",
      stderr: expect.stringContaining("sold: A1")
    });
  });
});
