import type { Catalog, CinemaState } from "../domain/catalog-types.js";

export interface CatalogRepository {
  load(): Promise<Catalog>;
}

export interface StateReader {
  load(): Promise<CinemaState>;
}

export interface StateRepository extends StateReader {
  save(state: CinemaState): Promise<void>;
}
