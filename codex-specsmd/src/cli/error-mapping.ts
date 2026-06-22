import { CommanderError } from "commander";

import { ApplicationError } from "../domain/errors.js";

export const CLI_EXIT_CODES = {
  unexpected: 1,
  input: 2,
  data: 3,
  persistence: 4
} as const;

export class CliInputError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "CliInputError";
  }
}

export interface CliFailure {
  readonly exitCode: number;
  readonly message: string;
  readonly isAlreadyRendered?: boolean;
}

const INPUT_ERROR_CODES = new Set([
  "MOVIE_NOT_FOUND",
  "SHOWTIME_NOT_FOUND",
  "INVALID_PURCHASE_REQUEST",
  "INVALID_SEAT_SELECTION",
  "INVALID_PRICING_INPUT",
  "INVALID_CONFIRMATION_SEQUENCE"
]);

const DATA_ERROR_CODES = new Set([
  "CATALOG_READ_ERROR",
  "STATE_READ_ERROR",
  "INVALID_CATALOG_DATA",
  "INVALID_STATE_DATA"
]);

export function mapCliError(error: unknown, isDebug = false): CliFailure {
  if (error instanceof CommanderError) {
    return {
      exitCode: error.code === "commander.helpDisplayed" ? 0 : CLI_EXIT_CODES.unexpected,
      message: "",
      isAlreadyRendered: true
    };
  }

  if (error instanceof CliInputError) {
    return { exitCode: CLI_EXIT_CODES.input, message: error.message };
  }

  if (error instanceof ApplicationError) {
    if (INPUT_ERROR_CODES.has(error.code)) {
      return { exitCode: CLI_EXIT_CODES.input, message: error.message };
    }
    if (DATA_ERROR_CODES.has(error.code)) {
      return {
        exitCode: CLI_EXIT_CODES.data,
        message: "Cinema data is unavailable or invalid."
      };
    }
    if (error.code === "STATE_WRITE_ERROR") {
      return {
        exitCode: CLI_EXIT_CODES.persistence,
        message: "Unable to persist the cinema purchase."
      };
    }
  }

  const message = isDebug && error instanceof Error && error.stack !== undefined
    ? error.stack
    : "Unexpected CLI error.";
  return { exitCode: CLI_EXIT_CODES.unexpected, message };
}
