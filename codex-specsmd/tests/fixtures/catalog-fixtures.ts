export function validCatalogInput(): Record<string, unknown> {
  return {
    movies: [
      { id: "movie-1", title: "First Movie", classification: "PG" },
      { id: "movie-2", title: "Second Movie" },
      { id: "movie-empty", title: "No Showtimes" }
    ],
    auditoriums: [
      { id: "auditorium-1", name: "Hall 1", seats: ["a1", "A2", "B1"] }
    ],
    showtimes: [
      {
        id: "showtime-1",
        movieId: "movie-1",
        startsAt: "2026-06-23T19:00:00Z",
        auditoriumId: "auditorium-1",
        format: "IMAX"
      },
      {
        id: "showtime-2",
        movieId: "movie-1",
        startsAt: "2026-06-24T19:00:00Z",
        auditoriumId: "auditorium-1",
        format: "3D"
      },
      {
        id: "showtime-3",
        movieId: "movie-2",
        startsAt: "2026-06-25T19:00:00Z",
        auditoriumId: "auditorium-1",
        format: "2D"
      }
    ]
  };
}

export function validStateInput(): Record<string, unknown> {
  return {
    version: 1,
    nextConfirmationSequence: 2,
    soldSeats: {
      "showtime-1": ["a2"]
    },
    purchases: []
  };
}
