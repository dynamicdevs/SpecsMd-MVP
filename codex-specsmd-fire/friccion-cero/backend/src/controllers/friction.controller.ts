import type { Request, Response } from "express";
import { PrismaFrictionCommentRepository } from "../repositories/friction-comment.repository.js";
import { PrismaFrictionRepository } from "../repositories/friction.repository.js";
import { prisma } from "../persistence/prisma.js";
import { FrictionService } from "../services/friction.service.js";
import { sendControllerError } from "./validation.js";

const frictionService = new FrictionService(
  new PrismaFrictionRepository(prisma),
  new PrismaFrictionCommentRepository(prisma)
);

export async function createFriction(request: Request, response: Response): Promise<void> {
  try {
    const friction = await frictionService.create(request.body);
    response.status(201).json(friction);
  } catch (error) {
    sendControllerError(response, error);
  }
}

export async function listFrictions(_request: Request, response: Response): Promise<void> {
  try {
    const frictions = await frictionService.findAll();
    response.status(200).json(frictions);
  } catch (error) {
    sendControllerError(response, error);
  }
}

export async function getFriction(request: Request, response: Response): Promise<void> {
  try {
    const friction = await frictionService.findById(request.params.id);
    response.status(200).json(friction);
  } catch (error) {
    sendControllerError(response, error);
  }
}

export async function updateFriction(request: Request, response: Response): Promise<void> {
  try {
    const friction = await frictionService.update(request.params.id, request.body);
    response.status(200).json(friction);
  } catch (error) {
    sendControllerError(response, error);
  }
}

export async function deleteFriction(request: Request, response: Response): Promise<void> {
  try {
    await frictionService.delete(request.params.id);
    response.status(204).send();
  } catch (error) {
    sendControllerError(response, error);
  }
}

export async function createFrictionComment(request: Request, response: Response): Promise<void> {
  try {
    const comment = await frictionService.createComment(request.params.id, request.body);
    response.status(201).json(comment);
  } catch (error) {
    sendControllerError(response, error);
  }
}

export async function listFrictionComments(request: Request, response: Response): Promise<void> {
  try {
    const comments = await frictionService.findComments(request.params.id);
    response.status(200).json(comments);
  } catch (error) {
    sendControllerError(response, error);
  }
}
