import type { Problem, Proficiency } from "@prisma/client";
import type { Submission } from "leetcode-query";

import type { AtLeast } from "@/shared/types";

import { prisma } from "../../../../prisma/client";
import * as reviews from "../../../shared/utils/reviews";
import { buildProblemSlugSubmissionsMap, buildProficiencyData } from "./helpers";

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
            proficiency: 4,
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

describe("buildProblemSlugSubmissionsMap", () => {
    it.skip("should build a map of problem slug to the earliest accepted submission", async () => {
        const submissions = [
            {
                titleSlug: "problem-slug-1",
                statusDisplay: "Accepted",
                timestamp: 1,
            },
            {
                titleSlug: "problem-slug-1",
                statusDisplay: "Accepted",
                timestamp: 2,
            },
            {
                titleSlug: "problem-slug-2",
                statusDisplay: "Accepted",
                timestamp: 3,
            },
        ] as Submission[];

        const result = await buildProblemSlugSubmissionsMap(submissions);

        expect(result.size).toEqual(2);
        expect(result.get("problem-slug-1")).toEqual(submissions[0]);
        expect(result.get("problem-slug-2")).toEqual(submissions[2]);
    });

    it("should handle submissions for problems with existing proficiency data", async () => {
        const submissions = [
            {
                titleSlug: "new-problem",
                statusDisplay: "Accepted",
                timestamp: 1,
            },
            {
                titleSlug: "existing-problem",
                statusDisplay: "Accepted",
                timestamp: 3, // After nextReviewTime
            },
            {
                titleSlug: "existing-problem",
                statusDisplay: "Accepted",
                timestamp: 4, // Later submission
            },
        ] as Submission[];

        // Mock Prisma responses
        jest.spyOn(prisma.problem, "findUnique").mockResolvedValueOnce(null);
        jest.spyOn(prisma.problem, "findUnique").mockResolvedValueOnce({
            id: 1,
            titleSlug: "existing-problem",
        } as Problem);
        jest.spyOn(prisma.problem, "findUnique").mockResolvedValueOnce({
            id: 1,
            titleSlug: "existing-problem",
        } as Problem);

        jest.spyOn(prisma.proficiency, "findUnique").mockResolvedValue({
            nextReviewTime: "2",
            proficiency: 2,
        } as Proficiency);
        jest.spyOn(prisma.proficiency, "findUnique").mockResolvedValue({
            nextReviewTime: "2",
            proficiency: 2,
        } as Proficiency);

        const result = await buildProblemSlugSubmissionsMap(submissions);

        expect(result.size).toBe(2);
        // Should select the earliest submission after nextReviewTime
        expect(result.get("new-problem")).toEqual(submissions[0]);
        expect(result.get("existing-problem")).toEqual(submissions[1]);
    });

    it("should not include submissions that are before nextReviewTime", async () => {
        const submissions = [
            {
                titleSlug: "existing-problem",
                statusDisplay: "Accepted",
                timestamp: 1, // Before nextReviewTime
            },
        ] as Submission[];

        // Mock Prisma responses
        jest.spyOn(prisma.problem, "findUnique").mockResolvedValueOnce({
            id: 1,
            titleSlug: "existing-problem",
        } as Problem);

        jest.spyOn(prisma.proficiency, "findUnique").mockResolvedValue({
            nextReviewTime: "2",
            proficiency: 2,
        } as Proficiency);

        const result = await buildProblemSlugSubmissionsMap(submissions);

        expect(result.size).toBe(0);
    });
});
