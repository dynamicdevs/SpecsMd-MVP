import { readFile } from "node:fs/promises";

import type { Catalog } from "../domain/catalog-types.js";
import { ApplicationError } from "../domain/errors.js";
import type { CatalogRepository } from "../application/ports.js";
import { parseCatalog } from "./json-validation.js";

export class JsonCatalogRepository implements CatalogRepository {
  public constructor(private readonly catalogPath: string) {}

  public async load(): Promise<Catalog> {
    let text: string;
    try {
      text = await readFile(this.catalogPath, "utf8");
    } catch (error: unknown) {
      throw new ApplicationError(
        "CATALOG_READ_ERROR",
        `Unable to read catalog data from '${this.catalogPath}'.`,
        { cause: error }
      );
    }

    let value: unknown;
    try {
      value = JSON.parse(text) as unknown;
    } catch (error: unknown) {
      throw new ApplicationError("INVALID_CATALOG_DATA", "Catalog JSON is malformed.", {
        cause: error
      });
    }
    return parseCatalog(value);
  }
}
