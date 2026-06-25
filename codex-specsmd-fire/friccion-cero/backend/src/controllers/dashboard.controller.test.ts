import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { resetDatabase } from "../persistence/database.js";
import { prisma } from "../persistence/prisma.js";
import { setupDatabaseSchema } from "../persistence/setup-database.js";

const app = createApp();

beforeAll(async () => {
  await setupDatabaseSchema(prisma);
});

beforeEach(async () => {
  await resetDatabase(prisma);
});

afterAll(async () => {
  await resetDatabase(prisma);
  await prisma.$disconnect();
});

describe("Dashboard API", () => {
  it("returns zeroed metrics when there is no persisted data", async () => {
    const response = await request(app).get("/api/dashboard").expect(200);

    expect(response.body).toMatchObject({
      totals: {
        frictions: 0,
        monthlyHoursLost: 0,
        estimatedMonthlyCost: 0,
        initiatives: 0
      },
      initiativeCountsByStatus: {},
      frictionCountsByCategory: {},
      frictionCountsByPriority: {},
      frictionCountsByStatus: {},
      mostCostlyFrictions: []
    });
  });

  it("aggregates totals, grouped counts, and costly friction ranking", async () => {
    const duplicateData = await createFriction({
      title: "Duplicate client entry",
      description: "Client data is duplicated manually in two disconnected systems.",
      area: "Sales",
      frequency: "daily",
      timeLostMinutes: 10,
      peopleAffected: 5,
      painLevel: "medium",
      status: "open"
    });
    const createdManualApprovals = await createFriction({
      title: "Manual approval queue",
      description: "Approvals are manual and create long delays.",
      area: "Finance",
      frequency: "weekly",
      timeLostMinutes: 90,
      peopleAffected: 8,
      painLevel: "high",
      status: "in_review"
    });
    const manualApprovalsResponse = await request(app)
      .put(`/api/frictions/${createdManualApprovals.id}`)
      .send({ category: "manual_approvals" })
      .expect(200);
    const manualApprovals = manualApprovalsResponse.body as Record<string, unknown>;

    await request(app)
      .post(`/api/frictions/${duplicateData.id}/initiatives`)
      .send({
        title: "Sync client data",
        proposedSolution: "Connect both systems with an automated sync.",
        expectedReductionPercent: 80,
        complexity: "medium",
        status: "planned"
      })
      .expect(201);
    await request(app)
      .post(`/api/frictions/${manualApprovals.id}/initiatives`)
      .send({
        title: "Approval workflow",
        proposedSolution: "Route approvals through a workflow queue.",
        expectedReductionPercent: 70,
        complexity: "high",
        status: "in_progress"
      })
      .expect(201);

    const response = await request(app).get("/api/dashboard").expect(200);

    expect(response.body.totals).toMatchObject({
      frictions: 2,
      monthlyHoursLost: 66.33,
      estimatedMonthlyCost: 1658.25,
      initiatives: 2
    });
    expect(response.body.frictionCountsByCategory).toMatchObject({
      manual_repetitive_work: 1,
      manual_approvals: 1
    });
    expect(response.body.frictionCountsByPriority).toMatchObject({
      medium: 1,
      high: 1
    });
    expect(response.body.frictionCountsByStatus).toMatchObject({
      open: 1,
      in_review: 1
    });
    expect(response.body.initiativeCountsByStatus).toMatchObject({
      planned: 1,
      in_progress: 1
    });
    expect(response.body.mostCostlyFrictions.map((friction: { id: string }) => friction.id)).toEqual([
      manualApprovals.id,
      duplicateData.id
    ]);
  });
});

async function createFriction(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  const response = await request(app)
    .post("/api/frictions")
    .send(payload)
    .expect(201);

  return response.body as Record<string, unknown>;
}
