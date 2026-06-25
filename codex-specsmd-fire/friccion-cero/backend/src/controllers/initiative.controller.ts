import type { Request, Response } from "express";
import { prisma } from "../persistence/prisma.js";
import { PrismaFrictionRepository } from "../repositories/friction.repository.js";
import { PrismaInitiativeRepository } from "../repositories/initiative.repository.js";
import { InitiativeService } from "../services/initiative.service.js";
import { sendControllerError } from "./validation.js";

const initiativeService = new InitiativeService(
  new PrismaInitiativeRepository(prisma),
  new PrismaFrictionRepository(prisma)
);

export async function createInitiative(request: Request, response: Response): Promise<void> {
  try {
    const initiative = await initiativeService.createFromFriction(request.params.frictionId, request.body);
    response.status(201).json(initiative);
  } catch (error) {
    sendControllerError(response, error);
  }
}

export async function listInitiatives(_request: Request, response: Response): Promise<void> {
  try {
    const initiatives = await initiativeService.findAll();
    response.status(200).json(initiatives);
  } catch (error) {
    sendControllerError(response, error);
  }
}

export async function getInitiative(request: Request, response: Response): Promise<void> {
  try {
    const initiative = await initiativeService.findById(request.params.id);
    response.status(200).json(initiative);
  } catch (error) {
    sendControllerError(response, error);
  }
}

export async function updateInitiative(request: Request, response: Response): Promise<void> {
  try {
    const initiative = await initiativeService.update(request.params.id, request.body);
    response.status(200).json(initiative);
  } catch (error) {
    sendControllerError(response, error);
  }
}

export async function deleteInitiative(request: Request, response: Response): Promise<void> {
  try {
    await initiativeService.delete(request.params.id);
    response.status(204).send();
  } catch (error) {
    sendControllerError(response, error);
  }
}
