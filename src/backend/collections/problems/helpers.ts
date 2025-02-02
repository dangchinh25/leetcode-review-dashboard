import type { Prisma, Problem } from "@prisma/client";
import type { Submission } from "leetcode-query";

import type { AtLeast } from "@/shared/types";

import { getNextReviewTime } from "../../utils/reviews";

export const buildProficiencyData = (
    problem: AtLeast<Problem, "id">,
    submission: AtLeast<Submission, "timestamp">,
    proficiency?: number,
) => {
    const proficiencyData: Prisma.ProficiencyUncheckedCreateInput = {
        problemId: problem.id,
        lastSubmissionTime: submission.timestamp.toString(),
        nextReviewTime: getNextReviewTime({
            lastSubmissionTime: submission.timestamp.toString(),
            proficiency: proficiency ?? 0,
        }),
        proficiency: proficiency ?? 1,
    };

    return proficiencyData;
};
