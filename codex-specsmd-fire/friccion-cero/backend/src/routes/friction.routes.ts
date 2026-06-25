import { Router } from "express";
import {
  createFriction,
  createFrictionComment,
  deleteFriction,
  getFriction,
  listFrictionComments,
  listFrictions,
  updateFriction
} from "../controllers/friction.controller.js";

export const frictionRouter = Router();

frictionRouter.get("/", listFrictions);
frictionRouter.post("/", createFriction);
frictionRouter.get("/:id", getFriction);
frictionRouter.put("/:id", updateFriction);
frictionRouter.delete("/:id", deleteFriction);
frictionRouter.get("/:id/comments", listFrictionComments);
frictionRouter.post("/:id/comments", createFrictionComment);
