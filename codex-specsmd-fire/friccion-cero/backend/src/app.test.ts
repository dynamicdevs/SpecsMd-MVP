import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("Friccion Cero backend foundation", () => {
  const app = createApp();

  it("responds to the health endpoint", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      status: "ok",
      service: "friccion-cero-backend"
    });
  });

  it("serves OpenAPI documentation", async () => {
    const response = await request(app).get("/api/docs/").expect(200);

    expect(response.text).toContain("Swagger UI");
  });
});
