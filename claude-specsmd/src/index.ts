#!/usr/bin/env node
import { buildProgram } from './program';

// CLI entry point: wire Commander and parse process arguments.
void buildProgram().parseAsync(process.argv);
