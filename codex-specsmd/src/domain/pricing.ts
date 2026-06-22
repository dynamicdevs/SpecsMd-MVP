import { ApplicationError } from "./errors.js";
import type { PriceSubtotal } from "./purchase-types.js";

export const FORMAT_PRICE_MINOR_UNITS = {
  "2D": 800,
  "3D": 1100,
  IMAX: 1500
} as const;

function invalidPricing(message: string): ApplicationError {
  return new ApplicationError("INVALID_PRICING_INPUT", message);
}

export function calculateSubtotal(format: string, seatCount: number): PriceSubtotal {
  if (!Object.hasOwn(FORMAT_PRICE_MINOR_UNITS, format)) {
    throw invalidPricing(`Unsupported presentation format: ${format}`);
  }
  if (!Number.isSafeInteger(seatCount) || seatCount <= 0) {
    throw invalidPricing("seatCount must be a positive safe integer.");
  }

  const unitPrice = FORMAT_PRICE_MINOR_UNITS[format as keyof typeof FORMAT_PRICE_MINOR_UNITS];
  const subtotal = unitPrice * seatCount;
  if (!Number.isSafeInteger(subtotal)) {
    throw invalidPricing("Calculated subtotal exceeds the safe integer range.");
  }

  return { currency: "USD", unitPrice, subtotal };
}
