---
id: friccion-cero
title: Friccion Cero
status: completed
created: 2026-06-24T15:46:27-04:00
completed_at: 2026-06-25T17:15:56.153Z
---

# Intent: Friccion Cero

## Goal

Build a functional fullstack MVP called Friccion Cero using Specs.md with FIRE. The product helps teams, companies, and internal areas detect, register, measure, and prioritize operational frictions that cause lost time, repetitive manual work, waiting, human errors, duplicated data, and lack of traceability.

## Users

Teams, companies, internal operations areas, improvement leaders, process owners, and managers who need a practical way to identify costly operational friction and convert it into improvement initiatives.

## Problem

Operational friction is often discussed informally but not captured with enough structure to quantify its monthly impact, compare priorities, or turn problems into trackable improvement initiatives. Teams need a simple system that records the friction, estimates time and cost impact, classifies the type of friction, suggests priority, and tracks follow-up initiatives.

## Success Criteria

- Users can create, read, update, and delete frictions through a functional Angular frontend connected to a Node.js/Express API.
- The system automatically calculates monthly hours lost using time per event, monthly frequency, and people affected.
- The system estimates monthly cost from monthly hours lost and a configurable hourly cost.
- The system classifies frictions into basic categories using simple rules.
- The system assigns priority using impact, pain level, and automation potential.
- Users can convert a friction into an improvement initiative with proposed solution, expected time reduction, complexity, priority, and status.
- Users can view and manage initiatives with basic tracking.
- A dashboard shows general metrics and a ranking of the most costly frictions.
- The codebase is clean, modular, and extensible, separating entities, DTOs, services, controllers, and repositories.
- Basic tests and execution documentation are included.

## Constraints

- Frontend must use Angular with PrimeNG.
- Backend must use Node.js with TypeScript and Express.
- Initial database must be SQLite.
- Architecture must be clean and modular without overengineering the MVP.
- Important technical decisions must be briefly explained.
- When ambiguity appears, use the simplest practical decision that keeps MVP development moving.
- Implementation should be incremental: backend base, data model, friction API, initiative API, calculation/classification services, frontend base, main screens, dashboard, basic tests, and execution docs.

## Notes

Initial entities: Friction, Initiative, and FrictionComment. Initial calculations: monthly hours lost = time per event in minutes * monthly frequency * people affected / 60; estimated monthly cost = monthly hours lost * configurable hourly value. High automation potential applies to repetitive tasks, duplicated data, manual approvals, and missing integrations. Categories include repetitive manual work, third-party waiting, duplicated data, unnecessary meetings, manual approvals, missing system integration, excessive information search, recurring human errors, and lack of traceability.
