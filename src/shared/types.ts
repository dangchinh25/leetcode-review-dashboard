import { z } from "zod";

import { ProblemSchema, ProficiencySchema } from "../../prisma/generated/zod";

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

const ProblemReviewStatus = ["reviewDue", "reviewScheduled", "mastered"] as const;

export type ProblemReviewStatus = (typeof ProblemReviewStatus)[number];

export const ProblemReviewStatusSchema = z.enum(ProblemReviewStatus);

export const ProblemWithProficiencySchema = ProblemSchema.extend({
    proficiency: ProficiencySchema,
});

export type ProblemWithProficiency = z.infer<typeof ProblemWithProficiencySchema>;
