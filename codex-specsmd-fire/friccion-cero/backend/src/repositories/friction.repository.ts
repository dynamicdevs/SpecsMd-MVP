import type { PrismaClient } from "@prisma/client";
import type { CreateFrictionDto, UpdateFrictionDto } from "../dtos/friction.dto.js";

export interface FrictionRepository {
  create(data: CreateFrictionDto): Promise<unknown>;
  findById(id: string): Promise<unknown | null>;
  findAll(): Promise<unknown[]>;
  update(id: string, data: UpdateFrictionDto): Promise<unknown>;
  delete(id: string): Promise<void>;
}

export class PrismaFrictionRepository implements FrictionRepository {
  public constructor(private readonly client: PrismaClient) {}

  public create(data: CreateFrictionDto): Promise<unknown> {
    return this.client.friction.create({ data });
  }

  public findById(id: string): Promise<unknown | null> {
    return this.client.friction.findUnique({
      where: { id },
      include: {
        initiatives: true,
        comments: true
      }
    });
  }

  public findAll(): Promise<unknown[]> {
    return this.client.friction.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  public update(id: string, data: UpdateFrictionDto): Promise<unknown> {
    return this.client.friction.update({
      where: { id },
      data
    });
  }

  public async delete(id: string): Promise<void> {
    await this.client.friction.delete({ where: { id } });
  }
}
