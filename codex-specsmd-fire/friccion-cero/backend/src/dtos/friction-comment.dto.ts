import { z } from "zod";

export const createFrictionCommentSchema = z.object({
  frictionId: z.string().min(1),
  comment: z.string().min(1)
});

export const frictionCommentSchema = createFrictionCommentSchema.extend({
  id: z.string(),
  createdAt: z.date()
});

export type CreateFrictionCommentDto = z.infer<typeof createFrictionCommentSchema>;
export type FrictionCommentDto = z.infer<typeof frictionCommentSchema>;
