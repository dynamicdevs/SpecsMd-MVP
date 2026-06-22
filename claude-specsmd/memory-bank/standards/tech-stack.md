# Tech Stack

## Overview

A lightweight, framework-free TypeScript CLI built on Node.js. The stack is deliberately minimal — Commander.js for the command interface, Vitest for tests, and plain JSON files as mock data — so the same realistic cinema ticket-purchasing case runs identically across Claude Code, Codex, and Kiro.

## Languages

**TypeScript** (on Node.js)

Type safety catches errors early and makes the domain logic (seat validation, format pricing, discounts) self-documenting. Node.js gives broad ecosystem support and consistent behavior across all three target tools.

## Framework

**Commander.js** (CLI library — framework-free)

No application framework. Commander.js handles command/option parsing for the CLI surface (view listings, list showtimes, choose seats, confirm purchase) while keeping the codebase small and easy to read.

## Authentication

N/A — this is a local CLI lab with no user accounts.

## Infrastructure & Deployment

Local execution only. The tool is run via npm scripts (e.g. `tsx`/compiled output); there is no remote deployment target. Mock data is stored in plain JSON files committed to the repo.

## Package Manager

**npm** — the default Node.js package manager. Chosen for lowest friction and consistent behavior across Claude Code, Codex, and Kiro.

## Testing

**Vitest** — fast unit test runner with native TypeScript/ESM support, used to verify domain logic (occupied-seat validation, 2D/3D/IMAX pricing, discounts, confirmation generation).

## Decision Relationships

- TypeScript + Node.js enables the Commander.js and Vitest choices (both first-class TS).
- JSON mock files replace a database, so no data-stack/ORM standard is needed.
- npm + framework-free design prioritize portability across the three AI tools being evaluated.
