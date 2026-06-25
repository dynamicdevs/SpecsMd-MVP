import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { resetDatabase } from "../persistence/database.js";
import { prisma } from "../persistence/prisma.js";
import { setupDatabaseSchema } from "../persistence/setup-database.js";

const app = createApp();

const frictionPayload = {
  title: "Manual approval delay",
  description: "Every request requires a manual approval and signature.",
  area: "Finance",
  frequency: "daily",
  timeLostMinutes: 15,
  peopleAffected: 6,
  painLevel: "high",
  status: "open"
};

const initiativePayload = {
  title: "Automate approval routing",
  proposedSolution: "Create a workflow that routes approvals automatically.",
  expectedReductionPercent: 70,
  complexity: "medium",
  status: "proposed"
};

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

async function createFriction(): Promise<Record<string, unknown>> {
  const response = await request(app)
    .post("/api/frictions")
    .send(frictionPayload)
    .expect(201);

  return response.body as Record<string, unknown>;
}

describe("Initiative API", () => {
  it("creates an initiative from an existing friction and inherits priority", async () => {
    const friction = await createFriction();

    const response = await request(app)
      .post(`/api/frictions/${friction.id}/initiatives`)
      .send(initiativePayload)
      .expect(201);

    expect(response.body).toMatchObject({
      frictionId: friction.id,
      title: "Automate approval routing",
      priority: friction.priority
    });
    expect(response.body.id).toBeTruthy();
  });

  it("lists initiatives with friction context", async () => {
    const friction = await createFriction();
    await request(app)
      .post(`/api/frictions/${friction.id}/initiatives`)
      .send(initiativePayload)
      .expect(201);

    const response = await request(app).get("/api/initiatives").expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      title: "Automate approval routing",
      friction: {
        id: friction.id,
        title: "Manual approval delay"
      }
    });
  });

  it("retrieves and updates initiative detail", async () => {
    const friction = await createFriction();
    const created = await request(app)
      .post(`/api/frictions/${friction.id}/initiatives`)
      .send(initiativePayload)
      .expect(201);

    const detail = await request(app).get(`/api/initiatives/${created.body.id}`).expect(200);
    const updated = await request(app)
      .put(`/api/initiatives/${created.body.id}`)
      .send({
        status: "in_progress",
        expectedReductionPercent: 85
      })
      .expect(200);

    expect(detail.body).toMatchObject({
      id: created.body.id,
      friction: {
        id: friction.id
      }
    });
    expect(updated.body).toMatchObject({
      status: "in_progress",
      expectedReductionPercent: 85
    });
  });

  it("deletes an initiative", async () => {
    const friction = await createFriction();
    const created = await request(app)
      .post(`/api/frictions/${friction.id}/initiatives`)
      .send(initiativePayload)
      .expect(201);

    await request(app).delete(`/api/initiatives/${created.body.id}`).expect(204);
    await request(app).get(`/api/initiatives/${created.body.id}`).expect(404);
  });

  it("returns not found for missing source friction", async () => {
    await request(app)
      .post("/api/frictions/missing-friction/initiatives")
      .send(initiativePayload)
      .expect(404);
  });

  it("returns useful validation errors", async () => {
    const friction = await createFriction();

    const response = await request(app)
      .post(`/api/frictions/${friction.id}/initiatives`)
      .send({
        title: "",
        expectedReductionPercent: 150
      })
      .expect(400);

    expect(response.body).toMatchObject({
      error: "ValidationError"
    });
    expect(response.body.issues.length).toBeGreaterThan(0);
  });
});
