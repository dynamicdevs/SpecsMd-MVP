#!/usr/bin/env node

import { createRuntimeDependencies, runCli } from "./runtime.js";

const catalogPath = process.env["CINEMA_CATALOG_PATH"];
const statePath = process.env["CINEMA_STATE_PATH"];

process.exitCode = await runCli(
  process.argv.slice(2),
  createRuntimeDependencies({
    ...(catalogPath === undefined ? {} : { catalogPath }),
    ...(statePath === undefined ? {} : { statePath })
  })
);
