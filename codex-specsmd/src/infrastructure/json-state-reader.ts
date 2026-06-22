import { readFile } from "node:fs/promises";

import type { StateReader } from "../application/ports.js";
import type { CinemaState } from "../domain/catalog-types.js";
import { ApplicationError } from "../domain/errors.js";
import { parseCinemaState } from "./json-validation.js";

export class JsonStateReader implements StateReader {
  public constructor(private readonly statePath: string) {}

  public async load(): Promise<CinemaState> {
    let text: string;
    try {
      text = await readFile(this.statePath, "utf8");
    } catch (error: unknown) {
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
}
