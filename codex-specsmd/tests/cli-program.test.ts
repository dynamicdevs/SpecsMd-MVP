import { describe, expect, it, vi } from "vitest";

import type { CliDependencies } from "../src/cli/program.js";
import { runCli } from "../src/cli/runtime.js";
import { ApplicationError } from "../src/domain/errors.js";
import type { PurchaseConfirmation } from "../src/domain/purchase-types.js";

const confirmation: PurchaseConfirmation = {
  confirmationId: "CIN-000001",
  customerName: "Ada",
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

function harness(overrides: Partial<CliDependencies> = {}) {
  let stdout = "";
  let stderr = "";
  const prompt = vi.fn(async () => "unused");
  const complete = vi.fn(async () => confirmation);
  const dependencies: CliDependencies = {
    catalog: {
      listMovies: async () => [{ id: "movie-1", title: "First Movie", classification: "PG" }],
      listShowtimes: async () => [{
        id: "showtime-1",
        movieId: "movie-1",
        startsAt: "2026-06-23T19:00:00Z",
        auditoriumId: "auditorium-1",
        auditoriumName: "Hall 1",
        format: "IMAX"
      }],
      getSeatAvailability: async () => [{ seatId: "A1", status: "available" }]
    },
    purchases: { complete },
    writeOut: (text) => { stdout += text; },
    writeErr: (text) => { stderr += text; },
    isInteractive: false,
    prompt,
    ...overrides
  };
  return {
    dependencies,
    complete,
    prompt,
    stdout: () => stdout,
    stderr: () => stderr
  };
}

describe("cinema CLI program", () => {
  it("documents all public commands and their arguments or options", async () => {
    const root = harness();
    expect(await runCli(["--help"], root.dependencies)).toBe(0);
    expect(root.stdout()).toContain("movies");
    expect(root.stdout()).toContain("showtimes <movie-id>");
    expect(root.stdout()).toContain("seats <showtime-id>");
    expect(root.stdout()).toContain("buy [options]");

    const buy = harness();
    expect(await runCli(["buy", "--help"], buy.dependencies)).toBe(0);
    expect(buy.stdout()).toContain("--name <customer>");
    expect(buy.stdout()).toContain("--showtime <id>");
    expect(buy.stdout()).toContain("--seats <ids>");
  });

  it.each([
    ["movies", "movie-1 | First Movie | PG"],
    ["showtimes", "showtime-1 | 2026-06-23T19:00:00Z | IMAX | Hall 1"],
    ["seats", "A1 | available"]
  ])("renders successful %s output on stdout", async (command, expected) => {
    const test = harness();
    const argv = command === "movies"
      ? [command]
      : [command, command === "showtimes" ? "movie-1" : "showtime-1"];
    expect(await runCli(argv, test.dependencies)).toBe(0);
    expect(test.stdout()).toContain(expected);
    expect(test.stderr()).toBe("");
  });

  it("never prompts when all buy options are explicit", async () => {
    const test = harness();
    expect(await runCli([
      "buy", "--name", "Ada", "--showtime", "showtime-1", "--seats", "a1,b1"
    ], test.dependencies)).toBe(0);
    expect(test.prompt).not.toHaveBeenCalled();
    expect(test.complete).toHaveBeenCalledWith({
      customerName: "Ada",
      showtimeId: "showtime-1",
      seats: ["a1", "b1"]
    });
    expect(test.stdout()).toContain("Confirmation: CIN-000001");
  });

  it("prompts only for omitted values in an interactive terminal", async () => {
    const answers = new Map([
      ["Showtime id", "showtime-1"],
      ["Seats (comma-separated)", "A1"]
    ]);
    const prompt = vi.fn(async (label: string) => answers.get(label) ?? "");
    const test = harness({ isInteractive: true, prompt });
    expect(await runCli(["buy", "--name", "Ada"], test.dependencies)).toBe(0);
    expect(prompt.mock.calls.map(([label]) => label)).toEqual([
      "Showtime id",
      "Seats (comma-separated)"
    ]);
    expect(test.complete).toHaveBeenCalledWith({
      customerName: "Ada",
      showtimeId: "showtime-1",
      seats: ["A1"]
    });
  });

  it("fails immediately for omitted noninteractive purchase values", async () => {
    const test = harness();
    expect(await runCli(["buy", "--name", "Ada"], test.dependencies)).toBe(2);
    expect(test.prompt).not.toHaveBeenCalled();
    expect(test.complete).not.toHaveBeenCalled();
    expect(test.stdout()).toBe("");
    expect(test.stderr()).toBe("Error: Missing required buy options: --showtime, --seats.\n");
  });

  it("maps expected service failures to stderr without stack traces", async () => {
    const test = harness({
      catalog: {
        listMovies: async () => { throw new ApplicationError("INVALID_STATE_DATA", "C:\\secret"); },
        listShowtimes: async () => [],
        getSeatAvailability: async () => []
      }
    });
    expect(await runCli(["movies"], test.dependencies)).toBe(3);
    expect(test.stdout()).toBe("");
    expect(test.stderr()).toBe("Error: Cinema data is unavailable or invalid.\n");
  });

  it("returns stable Commander failure behavior for unknown commands", async () => {
    const test = harness();
    expect(await runCli(["not-a-command"], test.dependencies)).toBe(1);
    expect(test.stderr()).toContain("error: unknown command 'not-a-command'");
    expect(test.stderr()).not.toMatch(/\n\s+at\s/u);
  });
});
