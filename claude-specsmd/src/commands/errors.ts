/**
 * CLI/command-layer errors for data lookups. Distinct from domain errors:
 * these concern locating records by id, not the business rules.
 */

export class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Raised when a movie id is not found in the dataset. */
export class UnknownMovieError extends CliError {
  readonly movieId: string;
  constructor(movieId: string) {
    super(`Unknown movie id: ${movieId}`);
    this.movieId = movieId;
  }
}

/** Raised when a showtime id is not found in the dataset. */
export class UnknownShowtimeError extends CliError {
  readonly showtimeId: string;
  constructor(showtimeId: string) {
    super(`Unknown showtime id: ${showtimeId}`);
    this.showtimeId = showtimeId;
  }
}
