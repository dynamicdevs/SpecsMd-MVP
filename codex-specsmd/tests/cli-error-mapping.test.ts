import { CommanderError } from "commander";
import { describe, expect, it } from "vitest";

import {
  CLI_EXIT_CODES,
  CliInputError,
  mapCliError
} from "../src/cli/error-mapping.js";
import { ApplicationError } from "../src/domain/errors.js";

describe("CLI error mapping", () => {
  it.each([
    [new CliInputError("missing"), CLI_EXIT_CODES.input, "missing"],
    [new ApplicationError("SHOWTIME_NOT_FOUND", "unknown"), CLI_EXIT_CODES.input, "unknown"],
    [new ApplicationError("INVALID_CATALOG_DATA", "C:\\private\\catalog.json"), CLI_EXIT_CODES.data, "Cinema data is unavailable or invalid."],
    [new ApplicationError("STATE_WRITE_ERROR", "/private/state.json"), CLI_EXIT_CODES.persistence, "Unable to persist the cinema purchase."]
  ])("maps expected failures without paths or stacks", (error, exitCode, message) => {
    expect(mapCliError(error)).toEqual({ exitCode, message });
  });

  it("suppresses unexpected details unless debug mode is explicit", () => {
    const error = new Error("private detail");
    expect(mapCliError(error)).toEqual({
      exitCode: CLI_EXIT_CODES.unexpected,
      message: "Unexpected CLI error."
    });
    expect(mapCliError(error, true).message).toContain("private detail");
  });

  it("recognizes Commander help and usage failures as already rendered", () => {
    expect(mapCliError(new CommanderError(0, "commander.helpDisplayed", "help"))).toMatchObject({
      exitCode: 0,
      isAlreadyRendered: true
    });
    expect(mapCliError(new CommanderError(1, "commander.unknownCommand", "bad"))).toMatchObject({
      exitCode: CLI_EXIT_CODES.unexpected,
      isAlreadyRendered: true
    });
  });
});
