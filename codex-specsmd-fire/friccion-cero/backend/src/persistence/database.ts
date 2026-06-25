import type { PrismaClient } from "@prisma/client";

export async function connectDatabase(client: PrismaClient): Promise<void> {
  await client.$connect();
}

export async function disconnectDatabase(client: PrismaClient): Promise<void> {
  await client.$disconnect();
}

export async function resetDatabase(client: PrismaClient): Promise<void> {
  await client.frictionComment.deleteMany();
  await client.initiative.deleteMany();
  await client.friction.deleteMany();
}
