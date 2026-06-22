import {
  readFile,
  rename,
  rm,
  writeFile
} from "node:fs/promises";

import type { StateRepository } from "../application/ports.js";
import type { CinemaState } from "../domain/catalog-types.js";
import { ApplicationError } from "../domain/errors.js";
import { parseCinemaState } from "./json-validation.js";

export interface StateFileOperations {
  readFile(path: string): Promise<string>;
  writeFile(path: string, data: string): Promise<void>;
  rename(source: string, destination: string): Promise<void>;
  remove(path: string): Promise<void>;
}

const nodeFileOperations: StateFileOperations = {
  readFile: async (path) => readFile(path, "utf8"),
  writeFile: async (path, data) => writeFile(path, data, "utf8"),
  rename,
  remove: async (path) => rm(path, { force: true })
};

export const EMPTY_CINEMA_STATE: CinemaState = {
  version: 1,
  nextConfirmationSequence: 1,
  soldSeats: {},
  purchases: []
};

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

export class JsonStateRepository implements StateRepository {
  public constructor(
    private readonly statePath: string,
    private readonly operations: StateFileOperations = nodeFileOperations
  ) {}

  public async load(): Promise<CinemaState> {
    let text: string;
    try {
      text = await this.operations.readFile(this.statePath);
    } catch (error: unknown) {
      if (isMissingFile(error)) {
        return structuredClone(EMPTY_CINEMA_STATE);
      }
      throw new ApplicationError(
        "STATE_READ_ERROR",
        `Unable to read cinema state from '${this.statePath}'.`,
        { cause: error }
      );
    }

    let value: unknown;
    try {
      value = JSON.parse(text) as unknown;
    } catch (error: unknown) {
      throw new ApplicationError("INVALID_STATE_DATA", "State JSON is malformed.", {
        cause: error
      });
    }
    return parseCinemaState(value);
  }

  public async save(state: CinemaState): Promise<void> {
    const validated = parseCinemaState(state);
    const serialized = `${JSON.stringify(validated, null, 2)}\n`;
    const temporaryPath = `${this.statePath}.tmp`;

    try {
      await this.operations.remove(temporaryPath);
      await this.operations.writeFile(temporaryPath, serialized);
      await this.operations.rename(temporaryPath, this.statePath);
    } catch (error: unknown) {
      try {
        await this.operations.remove(temporaryPath);
      } catch {
        // Best-effort cleanup must not hide the original persistence failure.
      }
      throw new ApplicationError(
        "STATE_WRITE_ERROR",
        `Unable to persist cinema state to '${this.statePath}'.`,
        { cause: error }
      );
    }
  }
}
