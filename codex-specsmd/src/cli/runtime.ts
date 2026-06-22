import { resolve } from "node:path";
import type { Readable, Writable } from "node:stream";
import { fileURLToPath } from "node:url";

import { CinemaCatalogService } from "../application/catalog-queries.js";
import { PurchaseCompletionService } from "../application/complete-purchase.js";
import { JsonCatalogRepository } from "../infrastructure/json-catalog-repository.js";
import { JsonStateRepository } from "../infrastructure/json-state-repository.js";
import { mapCliError } from "./error-mapping.js";
import { createProgram, type CliDependencies } from "./program.js";
import { createTerminalPrompt } from "./prompts.js";

export interface RuntimeOptions {
  readonly catalogPath?: string;
  readonly statePath?: string;
  readonly input?: Readable;
  readonly output?: Writable;
  readonly errorOutput?: Writable;
  readonly isInteractive?: boolean;
}

const APPLICATION_ROOT = resolve(fileURLToPath(new URL("../../", import.meta.url)));

export function createRuntimeDependencies(options: RuntimeOptions = {}): CliDependencies {
  const input = options.input ?? process.stdin;
  const output = options.output ?? process.stdout;
  const errorOutput = options.errorOutput ?? process.stderr;
  const isInteractive = options.isInteractive ?? Boolean(process.stdin.isTTY);
  const catalogRepository = new JsonCatalogRepository(
    options.catalogPath ?? resolve(APPLICATION_ROOT, "data", "catalog.json")
  );
  const stateRepository = new JsonStateRepository(
    options.statePath ?? resolve(APPLICATION_ROOT, "data", "state.json")
  );

  return {
    catalog: new CinemaCatalogService(catalogRepository, stateRepository),
    purchases: new PurchaseCompletionService(catalogRepository, stateRepository),
    writeOut: (text) => output.write(text),
    writeErr: (text) => errorOutput.write(text),
    isInteractive,
    ...(isInteractive ? { prompt: createTerminalPrompt(input, output) } : {})
  };
}

export async function runCli(
  argv: readonly string[],
  dependencies: CliDependencies
): Promise<number> {
  const isDebug = argv.includes("--debug");
  try {
    await createProgram(dependencies).parseAsync([...argv], { from: "user" });
    return 0;
  } catch (error: unknown) {
    const failure = mapCliError(error, isDebug);
    if (failure.isAlreadyRendered !== true && failure.message.length > 0) {
      dependencies.writeErr(`Error: ${failure.message}\n`);
    }
    return failure.exitCode;
  }
}
