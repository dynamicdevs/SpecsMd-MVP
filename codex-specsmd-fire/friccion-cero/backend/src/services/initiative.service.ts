import { createInitiativeSchema, updateInitiativeSchema } from "../dtos/initiative.dto.js";
import { HttpError } from "../controllers/http-error.js";
import type { Priority } from "../entities/friction.js";
import type { FrictionRepository } from "../repositories/friction.repository.js";
import type { InitiativeRepository } from "../repositories/initiative.repository.js";

type FrictionWithPriority = {
  id: string;
  priority: Priority;
};

export class InitiativeService {
  public constructor(
    private readonly initiativeRepository: InitiativeRepository,
    private readonly frictionRepository: FrictionRepository
  ) {}

  public async createFromFriction(frictionId: string, input: unknown): Promise<unknown> {
    const friction = (await this.frictionRepository.findById(frictionId)) as FrictionWithPriority | null;

    if (!friction) {
      throw new HttpError(404, "Friction not found");
    }

    const parsed = createInitiativeSchema
      .omit({ frictionId: true })
      .parse(input);
    const priorityWasSupplied = typeof input === "object" && input !== null && "priority" in input;

    return this.initiativeRepository.create({
      ...parsed,
      frictionId,
      priority: priorityWasSupplied ? parsed.priority : friction.priority
    });
  }

  public findAll(): Promise<unknown[]> {
    return this.initiativeRepository.findAll();
  }

  public async findById(id: string): Promise<unknown> {
    const initiative = await this.initiativeRepository.findById(id);

    if (!initiative) {
      throw new HttpError(404, "Initiative not found");
    }

    return initiative;
  }

  public async update(id: string, input: unknown): Promise<unknown> {
    await this.findById(id);
    const parsed = updateInitiativeSchema.parse(input);

    return this.initiativeRepository.update(id, parsed);
  }

  public async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.initiativeRepository.delete(id);
  }
}
