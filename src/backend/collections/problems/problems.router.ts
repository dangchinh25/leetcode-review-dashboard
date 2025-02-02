import { z } from "zod";

import { isProblemMastered, isProblemReviewDue } from "@/backend/utils/reviews";

import { prisma } from "../../../../prisma/client";
import { ProblemSchema, ProficiencySchema } from "../../../../prisma/generated/zod";
import { publicProcedure, router } from "../../routers/router";

const ProblemsWithReviewStatusSchema = z.object({
    reviewDue: z.array(
        ProblemSchema.extend({
            proficiency: ProficiencySchema,
        }),
    ),
    reviewScheduled: z.array(
        ProblemSchema.extend({
            proficiency: ProficiencySchema,
        }),
    ),
    mastered: z.array(
        ProblemSchema.extend({
            proficiency: ProficiencySchema,
        }),
    ),
});

export const problemsRouter = router({
    getProblems: publicProcedure.output(ProblemsWithReviewStatusSchema).query(async () => {
        const problemWithProficiency = await prisma.problem.findMany({
            include: {
                proficiency: true,
            },
        });

        const response: z.infer<typeof ProblemsWithReviewStatusSchema> = {
            reviewDue: [],
            reviewScheduled: [],
            mastered: [],
        };

        for (const problem of problemWithProficiency) {
            if (!problem.proficiency) {
                continue;
            }

            if (isProblemMastered(problem.proficiency)) {
                response.mastered.push({
                    ...problem,
                    proficiency: problem.proficiency,
                });
            } else if (isProblemReviewDue(problem.proficiency)) {
                response.reviewDue.push({
                    ...problem,
                    proficiency: problem.proficiency,
                });
            } else {
                response.reviewScheduled.push({
                    ...problem,
                    proficiency: problem.proficiency,
                });
            }
        }

        return response;
    }),
});
