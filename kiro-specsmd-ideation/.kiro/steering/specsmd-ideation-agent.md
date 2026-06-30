# Ideation Agent

This steering file defines the ideation-driven development workflow for the kiro-specsmd-ideation workspace.

## Command Definition

```yaml
name: ideation-agent
description: Ideation-first development - brainstorm, evaluate opportunities, select, specify, design, then implement
```

## Workflow

1. **Brainstorm** — Expand the raw idea, identify users, problems, limits
2. **Opportunities** — Generate 5+ variants, evaluate each
3. **Select** — Choose one variant, justify
4. **Requirements** — Define functional/non-functional requirements
5. **Design** — Architecture and module breakdown
6. **Tasks** — Ordered, verifiable implementation checklist
7. **Implement** — Build following the spec documents

## Rules

- NEVER implement code before completing all 6 spec documents
- All specs live in `specs/ideaforge-local/`
- Implementation lives in `ideaforge-local/`
- Only use Ollama for AI (no external APIs)
- Keep everything local, simple, and console-based
