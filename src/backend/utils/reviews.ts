import type { Proficiency } from "@prisma/client";

import type { AtLeast } from "@/shared/types";

import { FORGETTING_CURVE } from "../../shared/constants";

export const isProblemMastered = (problemProficiency: Proficiency): boolean => {
    return problemProficiency.proficiency >= FORGETTING_CURVE.length;
};

export const isProblemReviewDue = (problemProficiency: Proficiency): boolean => {
    return (
        problemProficiency.proficiency < FORGETTING_CURVE.length &&
        parseInt(problemProficiency.nextReviewTime) <= Date.now()
    );
};

export const getNextReviewTime = (
    problemProficiency: AtLeast<Proficiency, "lastSubmissionTime" | "proficiency">,
): string => {
    return new Date(
        parseInt(problemProficiency.lastSubmissionTime) +
            FORGETTING_CURVE[problemProficiency.proficiency] * 60 * 1000,
    )
        .getTime()
        .toString();
};
