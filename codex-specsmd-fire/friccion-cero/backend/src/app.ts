import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi/openapi.js";
import { apiRouter } from "./routes/index.js";

export function createApp(): express.Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use("/", apiRouter);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  return app;
}
