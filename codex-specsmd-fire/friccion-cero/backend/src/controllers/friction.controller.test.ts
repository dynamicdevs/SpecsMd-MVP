import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { resetDatabase } from "../persistence/database.js";
import { prisma } from "../persistence/prisma.js";
import { setupDatabaseSchema } from "../persistence/setup-database.js";

const app = createApp();

const validFrictionPayload = {
  title: "Duplicate client entry",
  description: "Client data is duplicated manually in two disconnected systems.",
  area: "Sales",
  frequency: "daily",
  timeLostMinutes: 10,
  peopleAffected: 5,
  painLevel: "medium",
  status: "open"
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

describe("Friction API", () => {
  it("creates a friction with derived fields", async () => {
    const response = await request(app)
      .post("/api/frictions")
      .send(validFrictionPayload)
      .expect(201);

    expect(response.body).toMatchObject({
      title: "Duplicate client entry",
      category: "manual_repetitive_work",
      automationPotential: "high",
      monthlyHoursLost: 18.33,
      estimatedMonthlyCost: 458.25,
      priority: "medium"
    });
    expect(response.body.id).toBeTruthy();
  });

  it("lists and retrieves friction detail", async () => {
    const created = await request(app)
      .post("/api/frictions")
      .send(validFrictionPayload)
      .expect(201);

    const list = await request(app).get("/api/frictions").expect(200);
    const detail = await request(app).get(`/api/frictions/${created.body.id}`).expect(200);

    expect(list.body).toHaveLength(1);
    expect(detail.body).toMatchObject({
      id: created.body.id,
      comments: [],
      initiatives: []
    });
  });

  it("updates a friction and recalculates derived fields", async () => {
    const created = await request(app)
      .post("/api/frictions")
      .send(validFrictionPayload)
      .expect(201);

    const updated = await request(app)
      .put(`/api/frictions/${created.body.id}`)
      .send({
        timeLostMinutes: 60,
        peopleAffected: 10,
        painLevel: "high"
      })
      .expect(200);

    expect(updated.body).toMatchObject({
      monthlyHoursLost: 220,
      estimatedMonthlyCost: 5500,
      priority: "high"
    });
  });

  it("creates and lists comments for a friction", async () => {
    const created = await request(app)
      .post("/api/frictions")
      .send(validFrictionPayload)
      .expect(201);

    const comment = await request(app)
      .post(`/api/frictions/${created.body.id}/comments`)
      .send({ comment: "This blocks the revenue operations process." })
      .expect(201);
    const comments = await request(app)
      .get(`/api/frictions/${created.body.id}/comments`)
      .expect(200);

    expect(comment.body).toMatchObject({
      frictionId: created.body.id,
      comment: "This blocks the revenue operations process."
    });
    expect(comments.body).toHaveLength(1);
  });

  it("deletes a friction", async () => {
    const created = await request(app)
      .post("/api/frictions")
      .send(validFrictionPayload)
      .expect(201);

    await request(app).delete(`/api/frictions/${created.body.id}`).expect(204);
    await request(app).get(`/api/frictions/${created.body.id}`).expect(404);
  });

  it("returns useful validation errors", async () => {
    const response = await request(app)
      .post("/api/frictions")
      .send({ title: "" })
      .expect(400);

    expect(response.body).toMatchObject({
      error: "ValidationError"
    });
    expect(response.body.issues.length).toBeGreaterThan(0);
  });
});
