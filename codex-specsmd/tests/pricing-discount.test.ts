import { describe, expect, it } from "vitest";

import { applyTuesdayDiscount } from "../src/domain/discount.js";
import { calculateSubtotal } from "../src/domain/pricing.js";

describe("calculateSubtotal", () => {
  it.each([
    ["2D", 800],
    ["3D", 1100],
    ["IMAX", 1500]
  ])("prices %s at %i minor units per seat", (format, unitPrice) => {
    expect(calculateSubtotal(format, 3)).toEqual({
      currency: "USD",
      unitPrice,
      subtotal: unitPrice * 3
    });
  });

  it("rejects unsupported runtime formats", () => {
    expect(() => calculateSubtotal("4D", 1)).toThrow("Unsupported presentation format: 4D");
  });

  it.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid seat count %s",
    (seatCount) => {
      expect(() => calculateSubtotal("2D", seatCount)).toThrow(
        "seatCount must be a positive safe integer"
      );
    }
  );

  it("rejects subtotal overflow", () => {
    const overflowingCount = Math.floor(Number.MAX_SAFE_INTEGER / 800) + 1;
    expect(() => calculateSubtotal("2D", overflowingCount)).toThrow(
      "subtotal exceeds the safe integer range"
    );
  });
});

describe("applyTuesdayDiscount", () => {
  it("applies 20 percent on Tuesday using half-up minor-unit rounding", () => {
    expect(
      applyTuesdayDiscount(
        { currency: "USD", unitPrice: 803, subtotal: 803 },
        "2026-06-23T23:30:00Z"
      )
    ).toEqual({
      currency: "USD",
      unitPrice: 803,
      subtotal: 803,
      discount: 161,
      total: 642,
      isTuesdayDiscountApplied: true
    });
  });

  it("returns zero discount for a non-Tuesday showtime", () => {
    expect(
      applyTuesdayDiscount(
        { currency: "USD", unitPrice: 1100, subtotal: 2200 },
        "2026-06-24T00:30:00Z"
      )
    ).toMatchObject({ discount: 0, total: 2200, isTuesdayDiscountApplied: false });
  });

  it("uses UTC fixture weekday rather than host date or timezone", () => {
    const nearMidnightTuesday = "2026-06-23T23:59:59Z";
    const first = applyTuesdayDiscount(
      { currency: "USD", unitPrice: 1500, subtotal: 3000 },
      nearMidnightTuesday
    );
    const second = applyTuesdayDiscount(
      { currency: "USD", unitPrice: 1500, subtotal: 3000 },
      nearMidnightTuesday
    );

    expect(first).toEqual(second);
    expect(first.discount).toBe(600);
  });

  it.each([
    [{ currency: "USD" as const, unitPrice: 100, subtotal: -1 }, "subtotal"],
    [{ currency: "USD" as const, unitPrice: 100, subtotal: 1.5 }, "subtotal"],
    [{ currency: "USD" as const, unitPrice: -1, subtotal: 100 }, "unitPrice"],
    [{ currency: "USD" as const, unitPrice: 1.5, subtotal: 100 }, "unitPrice"]
  ])("rejects invalid money values %#", (price, field) => {
    expect(() => applyTuesdayDiscount(price, "2026-06-23T19:00:00Z")).toThrow(field);
  });

  it.each(["not-a-date", "2026-06-23", "2026-99-99T19:00:00Z"])(
    "rejects invalid UTC timestamp %s",
    (startsAt) => {
      expect(() =>
        applyTuesdayDiscount(
          { currency: "USD", unitPrice: 800, subtotal: 800 },
          startsAt
        )
      ).toThrow("ISO-8601 UTC timestamp");
    }
  );

  it("rejects unsafe Tuesday discount multiplication", () => {
    const subtotal = Math.floor((Number.MAX_SAFE_INTEGER - 50) / 20) + 1;
    expect(() =>
      applyTuesdayDiscount(
        { currency: "USD", unitPrice: 1, subtotal },
        "2026-06-23T19:00:00Z"
      )
    ).toThrow("Discount calculation exceeds the safe integer range");
  });
});
