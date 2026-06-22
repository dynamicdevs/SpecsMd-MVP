import { ApplicationError } from "./errors.js";
import type { PurchaseRequest, PurchaseRequestInput } from "./purchase-types.js";

function invalidRequest(message: string): ApplicationError {
  return new ApplicationError("INVALID_PURCHASE_REQUEST", message);
}

function requireNonblankString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw invalidRequest(`${field} must be a non-empty string.`);
  }
  return value.trim();
}

export function normalizePurchaseRequest(input: PurchaseRequestInput): PurchaseRequest {
  const customerName = requireNonblankString(input.customerName, "customerName");
  const showtimeId = requireNonblankString(input.showtimeId, "showtimeId");
  if (!Array.isArray(input.seats) || input.seats.length === 0) {
    throw invalidRequest("seats must contain at least one seat id.");
  }

  const seats = input.seats.map((seat, index) =>
    requireNonblankString(seat, `seats[${index}]`).toUpperCase()
  );
  const duplicates = seats.filter((seat, index) => seats.indexOf(seat) !== index);
  if (duplicates.length > 0) {
    throw invalidRequest(
      `seats contains duplicate normalized ids: ${[...new Set(duplicates)].join(", ")}.`
    );
  }

  return { customerName, showtimeId, seats };
}
