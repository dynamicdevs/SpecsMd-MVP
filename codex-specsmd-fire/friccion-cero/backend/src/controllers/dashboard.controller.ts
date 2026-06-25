import type { Request, Response } from "express";
import { prisma } from "../persistence/prisma.js";
import { PrismaFrictionRepository } from "../repositories/friction.repository.js";
import { PrismaInitiativeRepository } from "../repositories/initiative.repository.js";
import { DashboardService } from "../services/dashboard.service.js";
import { sendControllerError } from "./validation.js";

const dashboardService = new DashboardService(
  new PrismaFrictionRepository(prisma),
  new PrismaInitiativeRepository(prisma)
);

export async function getDashboardSummary(_request: Request, response: Response): Promise<void> {
  try {
    const summary = await dashboardService.getSummary();
    response.status(200).json(summary);
  } catch (error) {
    sendControllerError(response, error);
  }
}
