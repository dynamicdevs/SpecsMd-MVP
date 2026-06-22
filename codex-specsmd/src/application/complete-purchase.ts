import { completePreparedPurchase } from "../domain/purchase-completion.js";
import type {
  PurchaseConfirmation,
  PurchaseRequestInput
} from "../domain/purchase-types.js";
import type { CatalogRepository, StateRepository } from "./ports.js";
import { PurchasePreparationService } from "./prepare-purchase.js";

export class PurchaseCompletionService {
  private readonly preparationService: PurchasePreparationService;

  public constructor(
    catalogRepository: CatalogRepository,
    private readonly stateRepository: StateRepository
  ) {
    this.preparationService = new PurchasePreparationService(
      catalogRepository,
      stateRepository
    );
  }

  public async complete(input: PurchaseRequestInput): Promise<PurchaseConfirmation> {
    const preparation = await this.preparationService.prepare(input);
    const completion = completePreparedPurchase(preparation);
    await this.stateRepository.save(completion.nextState);
    return completion.confirmation;
  }
}
