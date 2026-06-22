export type ApplicationErrorCode =
  | "CATALOG_READ_ERROR"
  | "STATE_READ_ERROR"
  | "INVALID_CATALOG_DATA"
  | "INVALID_STATE_DATA"
  | "MOVIE_NOT_FOUND"
  | "SHOWTIME_NOT_FOUND"
  | "INVALID_PURCHASE_REQUEST"
  | "INVALID_SEAT_SELECTION"
  | "INVALID_PRICING_INPUT"
  | "INVALID_CONFIRMATION_SEQUENCE"
  | "STATE_WRITE_ERROR";

export class ApplicationError extends Error {
  public constructor(
    public readonly code: ApplicationErrorCode,
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = "ApplicationError";
  }
}

export function invalidCatalog(message: string): ApplicationError {
  return new ApplicationError("INVALID_CATALOG_DATA", message);
}

export function invalidState(message: string): ApplicationError {
  return new ApplicationError("INVALID_STATE_DATA", message);
}

export class SeatSelectionError extends ApplicationError {
  public constructor(
    message: string,
    public readonly nonexistentSeats: readonly string[],
    public readonly soldSeats: readonly string[]
  ) {
    super("INVALID_SEAT_SELECTION", message);
    this.name = "SeatSelectionError";
  }
}
