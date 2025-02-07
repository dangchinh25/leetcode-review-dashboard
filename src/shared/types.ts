import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { ProblemSchema, ProficiencySchema, TagSchema } from "../../prisma/generated/zod";

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

const ProblemReviewStatus = ["reviewDue", "reviewScheduled", "mastered", "notTracking"] as const;

export type ProblemReviewStatus = (typeof ProblemReviewStatus)[number];

export const ProblemReviewStatusSchema = z.enum(ProblemReviewStatus);

export const ProblemWithProficiencyTagsSchema = ProblemSchema.extend({
    proficiency: ProficiencySchema,
    tags: TagSchema.array(),
});

export type ProblemWithProficiency = Prisma.ProblemGetPayload<{
    include: {
        proficiency: true;
    };
}>;
