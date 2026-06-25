import type { PrismaClient } from "@prisma/client";
import type { CreateInitiativeDto, UpdateInitiativeDto } from "../dtos/initiative.dto.js";

export interface InitiativeRepository {
  create(data: CreateInitiativeDto): Promise<unknown>;
  findById(id: string): Promise<unknown | null>;
  findAll(): Promise<unknown[]>;
  update(id: string, data: UpdateInitiativeDto): Promise<unknown>;
  delete(id: string): Promise<void>;
}

export class PrismaInitiativeRepository implements InitiativeRepository {
  public constructor(private readonly client: PrismaClient) {}

  public create(data: CreateInitiativeDto): Promise<unknown> {
    return this.client.initiative.create({ data });
  }

  public findById(id: string): Promise<unknown | null> {
    return this.client.initiative.findUnique({
      where: { id },
      include: { friction: true }
    });
  }

  public findAll(): Promise<unknown[]> {
    return this.client.initiative.findMany({
      orderBy: { createdAt: "desc" },
      include: { friction: true }
    });
  }

  public update(id: string, data: UpdateInitiativeDto): Promise<unknown> {
    return this.client.initiative.update({
      where: { id },
      data
    });
  }

  public async delete(id: string): Promise<void> {
    await this.client.initiative.delete({ where: { id } });
  }
}
