import type { Prisma, Problem, Proficiency } from "@prisma/client";
import type { Submission } from "leetcode-query";

import type { AtLeast } from "@/shared/types";

import { getNextReviewTime, isProblemMastered, isProblemReviewDue } from "../../utils/reviews";

export const buildProficiencyData = (
    problem: AtLeast<Problem, "id">,
    submission: AtLeast<Submission, "timestamp">,
    proficiency?: number,
) => {
    const currentProficiency = proficiency ?? 0;

    const proficiencyData: Prisma.ProficiencyUncheckedCreateInput = {
        problemId: problem.id,
        lastSubmissionTime: submission.timestamp.toString(),
        nextReviewTime: getNextReviewTime({
            lastSubmissionTime: submission.timestamp.toString(),
            proficiency: currentProficiency,
        }),
        proficiency: currentProficiency + 1,
    };

    return proficiencyData;
};

export const shouldUpdateProficiency = (
    submission: AtLeast<Submission, "timestamp">,
    proficiency: Proficiency,
): boolean => {
    if (isProblemMastered(proficiency)) {
        return false;
    }

    if (
        isProblemReviewDue(proficiency) &&
        submission.timestamp > parseInt(proficiency.nextReviewTime)
    ) {
        return true;
    }

    return false;
};
