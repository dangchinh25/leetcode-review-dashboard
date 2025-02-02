import type { Problem } from "@prisma/client";
import type { Submission } from "leetcode-query";

import type { AtLeast } from "@/shared/types";

import * as reviews from "../../utils/reviews";
import { buildProficiencyData } from "./helpers";

describe("buildProficiencyData", () => {
    const mockProblem: AtLeast<Problem, "id"> = { id: 123 };
    const mockSubmission: AtLeast<Submission, "timestamp"> = { timestamp: 1710892800000 }; // 2024-03-20 00:00:00

    it("should build proficiency data with provided proficiency", () => {
        const proficiency = 3;

        const getNextReviewTimeSpy = jest.spyOn(reviews, "getNextReviewTime");
        const result = buildProficiencyData(mockProblem, mockSubmission, proficiency);

        expect(getNextReviewTimeSpy).toHaveBeenCalledWith({
            lastSubmissionTime: mockSubmission.timestamp.toString(),
            proficiency,
        });

        expect(result).toEqual({
            problemId: mockProblem.id,
            lastSubmissionTime: mockSubmission.timestamp.toString(),
            nextReviewTime: "1711497600000",
            proficiency: 3,
        });
    });

    it("should build proficiency data with default proficiency when not provided", () => {
        const result = buildProficiencyData(mockProblem, mockSubmission);

        const getNextReviewTimeSpy = jest.spyOn(reviews, "getNextReviewTime");

        expect(getNextReviewTimeSpy).toHaveBeenCalledWith({
            lastSubmissionTime: mockSubmission.timestamp.toString(),
            proficiency: 0,
        });

        expect(result).toEqual({
            problemId: mockProblem.id,
            lastSubmissionTime: mockSubmission.timestamp.toString(),
            nextReviewTime: "1710979200000",
            proficiency: 1,
        });
    });
});
