import type { Catalog } from "../domain/catalog-types.js";
import { invalidCatalog } from "../domain/errors.js";
import { applyTuesdayDiscount } from "../domain/discount.js";
import { calculateSubtotal } from "../domain/pricing.js";
import { normalizePurchaseRequest } from "../domain/purchase-request.js";
import type {
  PurchasePreparation,
  PurchaseRequestInput
} from "../domain/purchase-types.js";
import { validateSeatSelection } from "../domain/seat-selection.js";
import type { CatalogRepository, StateReader } from "./ports.js";

function findMovieForShowtime(catalog: Catalog, movieId: string) {
  const movie = catalog.movies.find((candidate) => candidate.id === movieId);
  if (movie === undefined) {
    throw invalidCatalog(`Showtime references unknown movie '${movieId}'.`);
  }
  return movie;
}

export class PurchasePreparationService {
  public constructor(
    private readonly catalogRepository: CatalogRepository,
    private readonly stateReader: StateReader
  ) {}

  public async prepare(input: PurchaseRequestInput): Promise<PurchasePreparation> {
    const request = normalizePurchaseRequest(input);
    const [catalog, state] = await Promise.all([
      this.catalogRepository.load(),
      this.stateReader.load()
    ]);
    const selection = validateSeatSelection(catalog, state, request);
    const movie = findMovieForShowtime(catalog, selection.showtime.movieId);
    const price = calculateSubtotal(selection.showtime.format, selection.seats.length);
    const pricing = applyTuesdayDiscount(price, selection.showtime.startsAt);

    return {
      purchase: {
        customerName: request.customerName,
        movie,
        showtime: selection.showtime,
        auditorium: selection.auditorium,
        seats: selection.seats,
        pricing
      },
      priorState: state
    };
  }
}
