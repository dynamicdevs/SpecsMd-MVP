import { Router } from "express";
import { dashboardRouter } from "./dashboard.routes.js";
import { getHealth } from "../controllers/health.controller.js";
import { frictionRouter } from "./friction.routes.js";
import { frictionInitiativeRouter, initiativeRouter } from "./initiative.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", getHealth);
apiRouter.use("/api/dashboard", dashboardRouter);
apiRouter.use("/api/frictions/:frictionId/initiatives", frictionInitiativeRouter);
apiRouter.use("/api/frictions", frictionRouter);
apiRouter.use("/api/initiatives", initiativeRouter);
