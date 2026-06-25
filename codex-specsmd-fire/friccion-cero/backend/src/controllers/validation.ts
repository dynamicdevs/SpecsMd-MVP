import type { Response } from "express";
import { ZodError } from "zod";
import { isHttpError } from "./http-error.js";

export function sendControllerError(response: Response, error: unknown): void {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: "ValidationError",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  if (isHttpError(error)) {
    response.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      details: error.details
    });
    return;
  }

  response.status(500).json({
    error: "InternalServerError",
    message: "Unexpected server error"
  });
}
