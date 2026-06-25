import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1).default("file:./friccion-cero.db"),
  DEFAULT_HOURLY_COST: z.coerce.number().positive().default(25)
});

export const env = envSchema.parse(process.env);
