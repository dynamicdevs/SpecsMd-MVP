import { describe, expect, it } from "vitest";

import { normalizePurchaseRequest } from "../src/domain/purchase-request.js";

describe("normalizePurchaseRequest", () => {
  it("trims customer and showtime and normalizes seats once", () => {
    expect(
      normalizePurchaseRequest({
        customerName: "  Ana Pérez  ",
        showtimeId: " showtime-1 ",
        seats: [" a1 ", "B2"]
      })
    ).toEqual({
      customerName: "Ana Pérez",
      showtimeId: "showtime-1",
      seats: ["A1", "B2"]
    });
  });

  it.each([
    [{ customerName: "", showtimeId: "showtime-1", seats: ["A1"] }, "customerName"],
    [{ customerName: "Ana", showtimeId: "  ", seats: ["A1"] }, "showtimeId"],
    [{ customerName: "Ana", showtimeId: "showtime-1", seats: "A1" }, "at least one"],
    [{ customerName: "Ana", showtimeId: "showtime-1", seats: [] }, "at least one"],
    [{ customerName: "Ana", showtimeId: "showtime-1", seats: [" "] }, "seats[0]"]
  ])("rejects invalid request %#", (input, message) => {
    expect(() => normalizePurchaseRequest(input)).toThrow(message);
  });

  it("rejects duplicate seat ids after trimming and uppercase normalization", () => {
    expect(() =>
      normalizePurchaseRequest({
        customerName: "Ana",
        showtimeId: "showtime-1",
        seats: ["a1", " A1 ", "b2", "B2"]
      })
    ).toThrow("duplicate normalized ids: A1, B2");
  });
});
