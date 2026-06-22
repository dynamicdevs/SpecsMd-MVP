import { ApplicationError } from "./errors.js";
import type { PriceSubtotal, PricingBreakdown } from "./purchase-types.js";

export const TUESDAY_DISCOUNT_PERCENT = 20;

function invalidPricing(message: string): ApplicationError {
  return new ApplicationError("INVALID_PRICING_INPUT", message);
}

export function applyTuesdayDiscount(
  price: PriceSubtotal,
  showtimeStartsAt: string
): PricingBreakdown {
  if (!Number.isSafeInteger(price.subtotal) || price.subtotal < 0) {
    throw invalidPricing("subtotal must be a non-negative safe integer.");
  }
  if (!Number.isSafeInteger(price.unitPrice) || price.unitPrice < 0) {
    throw invalidPricing("unitPrice must be a non-negative safe integer.");
  }

  const isoUtc = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u;
  const timestamp = Date.parse(showtimeStartsAt);
  if (!isoUtc.test(showtimeStartsAt) || Number.isNaN(timestamp)) {
    throw invalidPricing("showtimeStartsAt must be an ISO-8601 UTC timestamp.");
  }

  const isTuesdayDiscountApplied = new Date(timestamp).getUTCDay() === 2;
  if (
    isTuesdayDiscountApplied &&
    price.subtotal > Math.floor((Number.MAX_SAFE_INTEGER - 50) / TUESDAY_DISCOUNT_PERCENT)
  ) {
    throw invalidPricing("Discount calculation exceeds the safe integer range.");
  }

  const discount = isTuesdayDiscountApplied
    ? Math.floor(
        (price.subtotal * TUESDAY_DISCOUNT_PERCENT + 50) / 100
      )
    : 0;
  return {
    ...price,
    discount,
    total: price.subtotal - discount,
    isTuesdayDiscountApplied
  };
}
