/**
 * Typed domain errors. The command layer catches these and renders
 * user-facing messages; the domain itself never prints or exits.
 */

/** Base class for all domain errors. */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Raised when a seat selection is empty. */
export class EmptySeatSelectionError extends DomainError {
  constructor() {
    super('At least one seat must be selected.');
  }
}

/** Raised when the same seat code appears more than once in a selection. */
export class DuplicateSeatError extends DomainError {
  readonly codes: string[];
  constructor(codes: string[]) {
    super(`Duplicate seat code(s): ${codes.join(', ')}.`);
    this.codes = codes;
  }
}

/** Raised when a requested seat code does not exist in the showtime. */
export class UnknownSeatError extends DomainError {
  readonly codes: string[];
  constructor(codes: string[]) {
    super(`Unknown seat code(s): ${codes.join(', ')}.`);
    this.codes = codes;
  }
}

/** Raised when a requested seat exists but is already sold. */
export class SeatUnavailableError extends DomainError {
  readonly codes: string[];
  constructor(codes: string[]) {
    super(`Seat(s) already sold: ${codes.join(', ')}.`);
    this.codes = codes;
  }
}

/** Raised when a confirmation is requested without a customer name. */
export class MissingCustomerNameError extends DomainError {
  constructor() {
    super('A customer name is required.');
  }
}
