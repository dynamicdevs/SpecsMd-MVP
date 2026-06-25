import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { resetDatabase } from "../persistence/database.js";
import { setupDatabaseSchema } from "../persistence/setup-database.js";
import { PrismaFrictionCommentRepository } from "./friction-comment.repository.js";
import { PrismaFrictionRepository } from "./friction.repository.js";
import { PrismaInitiativeRepository } from "./initiative.repository.js";

const client = new PrismaClient();
const frictionRepository = new PrismaFrictionRepository(client);
const initiativeRepository = new PrismaInitiativeRepository(client);
const commentRepository = new PrismaFrictionCommentRepository(client);

beforeAll(async () => {
  await setupDatabaseSchema(client);
});

beforeEach(async () => {
  await resetDatabase(client);
});

afterAll(async () => {
  await resetDatabase(client);
  await client.$disconnect();
});

describe("Prisma repositories", () => {
  it("creates and reads a friction", async () => {
    const friction = await frictionRepository.create({
      title: "Manual report consolidation",
      description: "The operations team manually copies data between spreadsheets.",
      area: "Operations",
      category: "manual_repetitive_work",
      frequency: "weekly",
      timeLostMinutes: 45,
      peopleAffected: 3,
      painLevel: "high",
      automationPotential: "high",
      monthlyHoursLost: 9,
      estimatedMonthlyCost: 225,
      priority: "high",
      status: "open"
    });

    expect(friction).toHaveProperty("id");

    const found = await frictionRepository.findById((friction as { id: string }).id);

    expect(found).toMatchObject({
      title: "Manual report consolidation",
      priority: "high"
    });
  });

  it("creates related initiatives and comments for a friction", async () => {
    const friction = (await frictionRepository.create({
      title: "Duplicate client entry",
      description: "Client information is entered twice in disconnected tools.",
      area: "Sales",
      category: "data_duplication",
      frequency: "daily",
      timeLostMinutes: 10,
      peopleAffected: 5,
      painLevel: "medium",
      automationPotential: "high",
      monthlyHoursLost: 16.67,
      estimatedMonthlyCost: 416.75,
      priority: "high",
      status: "open"
    })) as { id: string };

    const initiative = await initiativeRepository.create({
      frictionId: friction.id,
      title: "Sync client records",
      proposedSolution: "Automate client record synchronization between tools.",
      expectedReductionPercent: 80,
      complexity: "medium",
      priority: "high",
      status: "proposed"
    });

    const comment = await commentRepository.create({
      frictionId: friction.id,
      comment: "This affects the weekly revenue operations workflow."
    });

    const found = await frictionRepository.findById(friction.id);
    const comments = await commentRepository.findByFrictionId(friction.id);

    expect(initiative).toHaveProperty("id");
    expect(comment).toHaveProperty("id");
    expect(found).toMatchObject({
      id: friction.id,
      initiatives: [expect.objectContaining({ title: "Sync client records" })],
      comments: [expect.objectContaining({ comment: "This affects the weekly revenue operations workflow." })]
    });
    expect(comments).toHaveLength(1);
  });
});
