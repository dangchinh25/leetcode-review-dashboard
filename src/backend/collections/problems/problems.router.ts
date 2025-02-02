import { z } from "zod";

import { getLeetcodeClient } from "@/backend/libs/leetcode";
import { isProblemMastered, isProblemReviewDue } from "@/backend/utils/reviews";
import { ProblemWithProficiencySchema } from "@/shared/types";

import { prisma } from "../../../../prisma/client";
import { publicProcedure, router } from "../../routers/router";

const ProblemsWithReviewStatusSchema = z.object({
    reviewDue: z.array(ProblemWithProficiencySchema),
    reviewScheduled: z.array(ProblemWithProficiencySchema),
    mastered: z.array(ProblemWithProficiencySchema),
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
    syncProblems: publicProcedure.mutation(async () => {
        const leetcodeClient = await getLeetcodeClient();
        const submissions = await leetcodeClient.getUserRecentSubmissions();

        console.log(submissions);

        return { success: true };
    }),
});
