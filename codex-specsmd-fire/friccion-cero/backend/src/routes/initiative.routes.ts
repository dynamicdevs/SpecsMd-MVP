import { Router } from "express";
import {
  createInitiative,
  deleteInitiative,
  getInitiative,
  listInitiatives,
  updateInitiative
} from "../controllers/initiative.controller.js";

export const initiativeRouter = Router();
export const frictionInitiativeRouter = Router({ mergeParams: true });

initiativeRouter.get("/", listInitiatives);
initiativeRouter.get("/:id", getInitiative);
initiativeRouter.put("/:id", updateInitiative);
initiativeRouter.delete("/:id", deleteInitiative);

frictionInitiativeRouter.post("/", createInitiative);
