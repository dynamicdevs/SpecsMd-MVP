import type { CreateFrictionCommentDto } from "../dtos/friction-comment.dto.js";
import { createFrictionCommentSchema } from "../dtos/friction-comment.dto.js";
import type { CreateFrictionDto, UpdateFrictionDto } from "../dtos/friction.dto.js";
import { createFrictionSchema, updateFrictionSchema } from "../dtos/friction.dto.js";
import { HttpError } from "../controllers/http-error.js";
import type { FrictionCommentRepository } from "../repositories/friction-comment.repository.js";
import type { FrictionRepository } from "../repositories/friction.repository.js";
import { enrichFrictionInput, type FrictionEnrichmentInput } from "./friction-enrichment.service.js";

type FrictionRecord = CreateFrictionDto & { id: string };

export class FrictionService {
  public constructor(
    private readonly frictionRepository: FrictionRepository,
    private readonly commentRepository: FrictionCommentRepository
  ) {}

  public async create(input: unknown): Promise<unknown> {
    const parsed = createFrictionSchema
      .omit({
        category: true,
        automationPotential: true,
        monthlyHoursLost: true,
        estimatedMonthlyCost: true,
        priority: true
      })
      .parse(input);
    const enriched = enrichFrictionInput(parsed);

    return this.frictionRepository.create(enriched);
  }

  public findAll(): Promise<unknown[]> {
    return this.frictionRepository.findAll();
  }

  public async findById(id: string): Promise<unknown> {
    const friction = await this.frictionRepository.findById(id);

    if (!friction) {
      throw new HttpError(404, "Friction not found");
    }

    return friction;
  }

  public async update(id: string, input: unknown): Promise<unknown> {
    const existing = (await this.frictionRepository.findById(id)) as FrictionRecord | null;

    if (!existing) {
      throw new HttpError(404, "Friction not found");
    }

    const parsed = updateFrictionSchema
      .omit({
        monthlyHoursLost: true,
        estimatedMonthlyCost: true,
        priority: true
      })
      .parse(input);
    const merged: FrictionEnrichmentInput = {
      title: parsed.title ?? existing.title,
      description: parsed.description ?? existing.description,
      area: parsed.area ?? existing.area,
      category: parsed.category ?? existing.category,
      frequency: parsed.frequency ?? existing.frequency,
      timeLostMinutes: parsed.timeLostMinutes ?? existing.timeLostMinutes,
      peopleAffected: parsed.peopleAffected ?? existing.peopleAffected,
      painLevel: parsed.painLevel ?? existing.painLevel,
      automationPotential: parsed.automationPotential,
      status: parsed.status ?? existing.status
    };
    const enriched = enrichFrictionInput(merged);

    return this.frictionRepository.update(id, enriched);
  }

  public async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.frictionRepository.delete(id);
  }

  public async createComment(frictionId: string, input: unknown): Promise<unknown> {
    await this.findById(frictionId);

    const parsed = createFrictionCommentSchema
      .omit({ frictionId: true })
      .parse(input);
    const comment: CreateFrictionCommentDto = {
      frictionId,
      comment: parsed.comment
    };

    return this.commentRepository.create(comment);
  }

  public async findComments(frictionId: string): Promise<unknown[]> {
    await this.findById(frictionId);

    return this.commentRepository.findByFrictionId(frictionId);
  }
}
