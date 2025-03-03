import type { Prisma, Problem, Proficiency } from "@prisma/client";
import type { Submission } from "leetcode-query";

import type { AtLeast } from "@/shared/types";

import { prisma } from "../../../../prisma/client";
import {
    getNextReviewTime,
    isProblemMastered,
    isProblemReviewDue,
} from "../../../shared/utils/reviews";

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

/**
 * We should update the proficiency if the problem is not mastered and
 * the submission is after the nextReviewTime
 */
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

/**
 * Map of problem slug to the earliest accepted submission
 * The submission should be
 * 1. Accepted
 * 2. If the problem & proficiency already exist in the database,
 *    we should use the earliest submission after the nextReviewTime
 * 3. Otherwise, we should use the earliest accepted submission
 */
export const buildProblemSlugSubmissionsMap = async (
    submissions: Submission[],
): Promise<Map<string, Submission>> => {
    const problemSlugSubmissionsMap = new Map<string, Submission>();

    for (const submission of submissions) {
        if (submission.statusDisplay !== "Accepted") {
            continue;
        }

        const problemSlug = submission.titleSlug;

        // Find the problem in database
        const existingProblem = await prisma.problem.findUnique({
            where: {
                titleSlug: problemSlug,
            },
        });
        let existingProficiency: Proficiency | null = null;

        if (existingProblem) {
            existingProficiency = await prisma.proficiency.findUnique({
                where: { problemId: existingProblem.id },
            });
        }

        if (existingProficiency) {
            // If the problem & proficiency already exist in the database,
            // we should use the earliest submission after the nextReviewTime
            if (shouldUpdateProficiency(submission, existingProficiency)) {
                if (!problemSlugSubmissionsMap.has(problemSlug)) {
                    problemSlugSubmissionsMap.set(problemSlug, submission);
                }

                const currentSubmission = problemSlugSubmissionsMap.get(problemSlug);

                if (currentSubmission && currentSubmission.timestamp > submission.timestamp) {
                    problemSlugSubmissionsMap.set(problemSlug, submission);
                }
            }
        } else {
            // If the problem & proficiency does not exist in the database,
            // we should use the earliest accepted submission
            if (!problemSlugSubmissionsMap.has(problemSlug)) {
                problemSlugSubmissionsMap.set(problemSlug, submission);
            }

            const currentSubmission = problemSlugSubmissionsMap.get(problemSlug);

            if (currentSubmission && currentSubmission.timestamp > submission.timestamp) {
                problemSlugSubmissionsMap.set(problemSlug, submission);
            }
        }
    }

    return problemSlugSubmissionsMap;
};
