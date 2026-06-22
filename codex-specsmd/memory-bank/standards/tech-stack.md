# Tech Stack

## Overview

This project is an offline, cross-platform TypeScript CLI built with Commander.js. It uses local JSON files for mock and persistent data, npm scripts for its lifecycle, and Vitest for automated tests.

## Languages

TypeScript with strict type checking, targeting a maintained Node.js LTS runtime.

## Framework

Commander.js provides command parsing, options, help output, and stable command boundaries.

## Authentication

Not applicable. The laboratory has no accounts or authentication.

## Infrastructure & Deployment

The CLI runs locally on Windows, macOS, and Linux. It performs no network calls and has no deployment target in this intent.

## Package Manager

npm

Project lifecycle operations are exposed through npm scripts, including build, start, test, and test coverage.

## Data

- Read-only mock catalog and showtime fixtures use JSON files.
- Purchases and sold-seat state persist in a local JSON state file.
- Tests use isolated, resettable fixture and state files.

## Decision Relationships

Commander.js remains a thin adapter over pure TypeScript domain logic. Vitest exercises the domain independently and verifies CLI flows at the command boundary.
