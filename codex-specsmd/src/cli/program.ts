import { Command } from "commander";

import type { CinemaCatalogService } from "../application/catalog-queries.js";
import type { PurchaseCompletionService } from "../application/complete-purchase.js";
import { CliInputError } from "./error-mapping.js";
import type { Prompt } from "./prompts.js";
import {
  renderConfirmation,
  renderMovies,
  renderSeats,
  renderShowtimes
} from "./renderers.js";

export type TextWriter = (text: string) => void;

export interface CliDependencies {
  readonly catalog: Pick<
    CinemaCatalogService,
    "listMovies" | "listShowtimes" | "getSeatAvailability"
  >;
  readonly purchases: Pick<PurchaseCompletionService, "complete">;
  readonly writeOut: TextWriter;
  readonly writeErr: TextWriter;
  readonly isInteractive: boolean;
  readonly prompt?: Prompt;
}

interface BuyOptions {
  readonly name?: string;
  readonly showtime?: string;
  readonly seats?: string;
}

function writeResult(write: TextWriter, result: string): void {
  write(result.length === 0 ? "\n" : `${result}\n`);
}

async function resolveBuyOptions(
  options: BuyOptions,
  dependencies: CliDependencies
): Promise<Required<BuyOptions>> {
  const missing = [
    options.name === undefined ? "--name" : undefined,
    options.showtime === undefined ? "--showtime" : undefined,
    options.seats === undefined ? "--seats" : undefined
  ].filter((option): option is string => option !== undefined);

  if (missing.length === 0) {
    return options as Required<BuyOptions>;
  }
  if (!dependencies.isInteractive || dependencies.prompt === undefined) {
    throw new CliInputError(`Missing required buy options: ${missing.join(", ")}.`);
  }

  return {
    name: options.name ?? await dependencies.prompt("Customer name"),
    showtime: options.showtime ?? await dependencies.prompt("Showtime id"),
    seats: options.seats ?? await dependencies.prompt("Seats (comma-separated)")
  };
}

export function createProgram(dependencies: CliDependencies): Command {
  const program = new Command()
    .name("cinema")
    .description("Offline cinema ticket purchase laboratory")
    .option("--debug", "show stack traces for unexpected failures")
    .showHelpAfterError()
    .exitOverride()
    .configureOutput({
      writeOut: dependencies.writeOut,
      writeErr: dependencies.writeErr
    });

  program
    .command("movies")
    .description("list the movie catalog")
    .action(async () => {
      writeResult(dependencies.writeOut, renderMovies(await dependencies.catalog.listMovies()));
    });

  program
    .command("showtimes")
    .description("list showtimes for a movie")
    .argument("<movie-id>", "movie identifier")
    .action(async (movieId: string) => {
      writeResult(
        dependencies.writeOut,
        renderShowtimes(await dependencies.catalog.listShowtimes(movieId))
      );
    });

  program
    .command("seats")
    .description("show seat availability for a showtime")
    .argument("<showtime-id>", "showtime identifier")
    .action(async (showtimeId: string) => {
      writeResult(
        dependencies.writeOut,
        renderSeats(await dependencies.catalog.getSeatAvailability(showtimeId))
      );
    });

  program
    .command("buy")
    .description("buy one or more cinema tickets")
    .option("--name <customer>", "customer name")
    .option("--showtime <id>", "showtime identifier")
    .option("--seats <ids>", "comma-separated seat identifiers")
    .action(async (options: BuyOptions) => {
      const resolved = await resolveBuyOptions(options, dependencies);
      const confirmation = await dependencies.purchases.complete({
        customerName: resolved.name,
        showtimeId: resolved.showtime,
        seats: resolved.seats.split(",")
      });
      writeResult(dependencies.writeOut, renderConfirmation(confirmation));
    });

  return program;
}
