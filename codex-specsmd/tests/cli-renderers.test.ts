import { describe, expect, it } from "vitest";

import {
  renderConfirmation,
  renderMovies,
  renderSeats,
  renderShowtimes
} from "../src/cli/renderers.js";

describe("CLI renderers", () => {
  it("renders catalog values in fixed field order", () => {
    expect(renderMovies([
      { id: "movie-1", title: "First", classification: "PG" },
      { id: "movie-2", title: "Second" }
    ])).toBe("movie-1 | First | PG\nmovie-2 | Second | unrated");

    expect(renderShowtimes([{
      id: "showtime-1",
      movieId: "movie-1",
      startsAt: "2026-06-23T19:00:00Z",
      auditoriumId: "auditorium-1",
      format: "IMAX",
      auditoriumName: "Hall 1"
    }])).toBe("showtime-1 | 2026-06-23T19:00:00Z | IMAX | Hall 1");

    expect(renderSeats([
      { seatId: "A1", status: "available" },
      { seatId: "A2", status: "sold" }
    ])).toBe("A1 | available\nA2 | sold");
  });

  it("renders every required confirmation field deterministically", () => {
    expect(renderConfirmation({
      confirmationId: "CIN-000001",
      customerName: "Ada",
      movieId: "movie-1",
      movieTitle: "First",
      showtimeId: "showtime-1",
      startsAt: "2026-06-23T19:00:00Z",
      format: "IMAX",
      auditoriumId: "auditorium-1",
      auditoriumName: "Hall 1",
      seats: ["A1", "B1"],
      currency: "USD",
      unitPrice: 1500,
      subtotal: 3000,
      discount: 600,
      total: 2400
    })).toBe([
      "Confirmation: CIN-000001",
      "Customer: Ada",
      "Movie: First (movie-1)",
      "Showtime: showtime-1",
      "Starts at: 2026-06-23T19:00:00Z",
      "Format: IMAX",
      "Auditorium: Hall 1 (auditorium-1)",
      "Seats: A1, B1",
      "Unit price: USD 15.00",
      "Subtotal: USD 30.00",
      "Discount: USD 6.00",
      "Total: USD 24.00"
    ].join("\n"));
  });
});
