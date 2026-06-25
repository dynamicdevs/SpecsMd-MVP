import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma.js";

export async function setupDatabaseSchema(client: PrismaClient): Promise<void> {
  await client.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Friction" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "area" TEXT NOT NULL,
      "category" TEXT NOT NULL,
      "frequency" TEXT NOT NULL,
      "timeLostMinutes" INTEGER NOT NULL,
      "peopleAffected" INTEGER NOT NULL,
      "painLevel" TEXT NOT NULL,
      "automationPotential" TEXT NOT NULL,
      "monthlyHoursLost" REAL NOT NULL DEFAULT 0,
      "estimatedMonthlyCost" REAL NOT NULL DEFAULT 0,
      "priority" TEXT NOT NULL,
      "status" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Initiative" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "frictionId" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "proposedSolution" TEXT NOT NULL,
      "expectedReductionPercent" INTEGER NOT NULL,
      "complexity" TEXT NOT NULL,
      "priority" TEXT NOT NULL,
      "status" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Initiative_frictionId_fkey"
        FOREIGN KEY ("frictionId") REFERENCES "Friction" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await client.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "FrictionComment" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "frictionId" TEXT NOT NULL,
      "comment" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "FrictionComment_frictionId_fkey"
        FOREIGN KEY ("frictionId") REFERENCES "Friction" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await client.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Friction_priority_idx" ON "Friction" ("priority");`);
  await client.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Friction_category_idx" ON "Friction" ("category");`);
  await client.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Friction_status_idx" ON "Friction" ("status");`);
  await client.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Initiative_frictionId_idx" ON "Initiative" ("frictionId");`);
  await client.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Initiative_priority_idx" ON "Initiative" ("priority");`);
  await client.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Initiative_status_idx" ON "Initiative" ("status");`);
  await client.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "FrictionComment_frictionId_idx" ON "FrictionComment" ("frictionId");`);
}

async function main(): Promise<void> {
  await setupDatabaseSchema(prisma);
  await prisma.$disconnect();
}

if (process.env.NODE_ENV !== "test" && process.argv[1]?.endsWith("setup-database.ts")) {
  main().catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
}
