import type { PrismaClient } from "@prisma/client";
import type { CreateFrictionCommentDto } from "../dtos/friction-comment.dto.js";

export interface FrictionCommentRepository {
  create(data: CreateFrictionCommentDto): Promise<unknown>;
  findByFrictionId(frictionId: string): Promise<unknown[]>;
}

export class PrismaFrictionCommentRepository implements FrictionCommentRepository {
  public constructor(private readonly client: PrismaClient) {}

  public create(data: CreateFrictionCommentDto): Promise<unknown> {
    return this.client.frictionComment.create({ data });
  }

  public findByFrictionId(frictionId: string): Promise<unknown[]> {
    return this.client.frictionComment.findMany({
      where: { frictionId },
      orderBy: { createdAt: "desc" }
    });
  }
}
