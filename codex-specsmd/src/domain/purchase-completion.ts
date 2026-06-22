import { ApplicationError } from "./errors.js";
import type {
  PurchaseCompletion,
  PurchaseConfirmation,
  PurchasePreparation
} from "./purchase-types.js";

export const MAX_CONFIRMATION_SEQUENCE = 999_999;

function confirmationId(sequence: number): string {
  return `CIN-${sequence.toString().padStart(6, "0")}`;
}

export function completePreparedPurchase(
  preparation: PurchasePreparation
): PurchaseCompletion {
  const { priorState, purchase } = preparation;
  const sequence = priorState.nextConfirmationSequence;
  if (!Number.isSafeInteger(sequence) || sequence < 1 || sequence > MAX_CONFIRMATION_SEQUENCE) {
    throw new ApplicationError(
      "INVALID_CONFIRMATION_SEQUENCE",
      "Confirmation sequence is invalid or exhausted."
    );
  }

  const confirmation: PurchaseConfirmation = {
    confirmationId: confirmationId(sequence),
    customerName: purchase.customerName,
    movieId: purchase.movie.id,
    movieTitle: purchase.movie.title,
    showtimeId: purchase.showtime.id,
    startsAt: purchase.showtime.startsAt,
    format: purchase.showtime.format,
    auditoriumId: purchase.auditorium.id,
    auditoriumName: purchase.auditorium.name,
    seats: [...purchase.seats],
    currency: purchase.pricing.currency,
    unitPrice: purchase.pricing.unitPrice,
    subtotal: purchase.pricing.subtotal,
    discount: purchase.pricing.discount,
    total: purchase.pricing.total
  };

  const previousSoldSeats = priorState.soldSeats[purchase.showtime.id] ?? [];
  const nextState = {
    version: 1 as const,
    nextConfirmationSequence: sequence + 1,
    soldSeats: {
      ...priorState.soldSeats,
      [purchase.showtime.id]: [...previousSoldSeats, ...purchase.seats]
    },
    purchases: [...priorState.purchases, confirmation]
  };

  return { confirmation, nextState };
}
