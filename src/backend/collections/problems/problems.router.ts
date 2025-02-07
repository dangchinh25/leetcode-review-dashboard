import type { Problem, Proficiency } from "@prisma/client";
import type { Submission } from "leetcode-query";
import { z } from "zod";

import { getLeetcodeClient } from "@/backend/libs/leetcode";
import type { ProblemWithProficiency } from "@/shared/types";
import { ProblemWithProficiencyTagsSchema } from "@/shared/types";
import { isProblemMastered, isProblemReviewDue } from "@/shared/utils/reviews";

import { prisma } from "../../../../prisma/client";
import { publicProcedure, router } from "../../routers/router";
import { buildProficiencyData, shouldUpdateProficiency } from "./helpers";

const ProblemsWithReviewStatusSchema = z.object({
    reviewDue: z.array(ProblemWithProficiencyTagsSchema),
    reviewScheduled: z.array(ProblemWithProficiencyTagsSchema),
    mastered: z.array(ProblemWithProficiencyTagsSchema),
    notTracking: z.array(ProblemWithProficiencyTagsSchema),
});

export const problemsRouter = router({
    getProblems: publicProcedure.output(ProblemsWithReviewStatusSchema).query(async () => {
        const problemWithProficiency = await prisma.problem.findMany({
            include: {
                proficiency: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const response: z.infer<typeof ProblemsWithReviewStatusSchema> = {
            reviewDue: [],
            reviewScheduled: [],
            mastered: [],
            notTracking: [],
        };

        for (const problem of problemWithProficiency) {
            if (!problem.proficiency) {
                continue;
            }

            if (!problem.proficiency.isTracking) {
                response.notTracking.push({
                    ...problem,
                    proficiency: problem.proficiency,
                    tags: problem.tags.map((t) => t.tag),
                });
            } else if (isProblemMastered(problem.proficiency)) {
                response.mastered.push({
                    ...problem,
                    proficiency: problem.proficiency,
                    tags: problem.tags.map((t) => t.tag),
                });
            } else if (isProblemReviewDue(problem.proficiency)) {
                response.reviewDue.push({
                    ...problem,
                    proficiency: problem.proficiency,
                    tags: problem.tags.map((t) => t.tag),
                });
            } else {
                response.reviewScheduled.push({
                    ...problem,
                    proficiency: problem.proficiency,
                    tags: problem.tags.map((t) => t.tag),
                });
            }
        }

        return response;
    }),
    syncProblems: publicProcedure.mutation(async () => {
        const leetcodeClient = await getLeetcodeClient();
        const submissions = await leetcodeClient.getUserRecentSubmissions();

        if (!submissions) {
            return { success: true, updatedProblemProficiencies: [] };
        }

        // Map of problem slug to the earliest accepted submission
        const problemSlugSubmissionsMap = new Map<string, Submission>();

        for (const submission of submissions) {
            if (submission.statusDisplay !== "Accepted") {
                continue;
            }

            const problemSlug = submission.titleSlug;

            if (!problemSlugSubmissionsMap.has(problemSlug)) {
                problemSlugSubmissionsMap.set(problemSlug, submission);
            }

            const currentSubmission = problemSlugSubmissionsMap.get(problemSlug);

            if (currentSubmission && currentSubmission.timestamp > submission.timestamp) {
                problemSlugSubmissionsMap.set(problemSlug, submission);
            }
        }

        const updatedProblemProficiencies: ProblemWithProficiency[] = [];

        try {
            // Wrap all database operations in a transaction
            await prisma.$transaction(async (tx) => {
                console.log("Starting syncing problems...");

                /**
                 * This could be optimized/refactor for better performance
                 * and cleaner code by querying for both problem and proficiency
                 * in a single query. Don't have time to do it right now and also
                 * Prisma types are a bit whack for nested types.
                 */
                const submissionPromises = Array.from(problemSlugSubmissionsMap.entries()).map(
                    async ([problemSlug, submission]) => {
                        let problem: Problem;
                        // Find the problem in database
                        const existingProblem = await tx.problem.findUnique({
                            where: {
                                titleSlug: problemSlug,
                            },
                        });

                        if (!existingProblem) {
                            // If it doesn't exist, fetch details from leetcode and create it
                            const problemDetails =
                                await leetcodeClient.getProblemDetail(problemSlug);
                            if (!problemDetails) {
                                return;
                            }
                            const upsertTagPromises = problemDetails.topicTags.map(async (tag) =>
                                tx.tag.upsert({
                                    where: { slug: tag.slug },
                                    update: {},
                                    create: {
                                        name: tag.name,
                                        slug: tag.slug,
                                    },
                                }),
                            );

                            problem = await tx.problem.create({
                                data: {
                                    title: problemDetails.title,
                                    titleSlug: problemDetails.titleSlug,
                                    difficulty: problemDetails.difficulty,
                                    questionId: problemDetails.questionFrontendId,
                                },
                            });
                            await Promise.all(upsertTagPromises);

                            const proficiency = await tx.proficiency.create({
                                data: buildProficiencyData(problem, submission),
                            });

                            updatedProblemProficiencies.push({
                                ...problem,
                                proficiency,
                            });
                        } else {
                            problem = existingProblem;
                            let updatedProficiency: Proficiency;

                            const proficiency = await tx.proficiency.findUnique({
                                where: {
                                    problemId: problem.id,
                                },
                            });

                            if (!proficiency) {
                                updatedProficiency = await tx.proficiency.create({
                                    data: buildProficiencyData(problem, submission),
                                });

                                updatedProblemProficiencies.push({
                                    ...problem,
                                    proficiency: updatedProficiency,
                                });
                            } else {
                                if (shouldUpdateProficiency(submission, proficiency)) {
                                    const proficiencyData = buildProficiencyData(
                                        problem,
                                        submission,
                                        proficiency.proficiency,
                                    );

                                    console.log(
                                        "Updating proficiency for problem",
                                        problem.id,
                                        problem.title,
                                        "old proficiency",
                                        proficiency.proficiency,
                                        "new proficiency",
                                        proficiencyData.proficiency,
                                    );

                                    updatedProficiency = await tx.proficiency.update({
                                        where: {
                                            id: proficiency.id,
                                        },
                                        data: proficiencyData,
                                    });

                                    updatedProblemProficiencies.push({
                                        ...problem,
                                        proficiency: updatedProficiency,
                                    });
                                }
                            }
                        }
                    },
                );

                await Promise.all(submissionPromises);
            });

            return { success: true, updatedProblemProficiencies };
        } catch (error) {
            console.error("Failed to sync problems:", error);

            // If it's a Prisma error, we can be more specific
            if (error instanceof Error) {
                return {
                    success: false,
                    error: `Failed to sync problems: ${error.message}`,
                };
            }

            return {
                success: false,
                error: "An unexpected error occurred while syncing problems",
            };
        }
    }),
    syncProblem: publicProcedure
        .input(z.object({ titleSlug: z.string() }))
        .mutation(async ({ input }) => {
            const leetcodeClient = await getLeetcodeClient();
            const [problemDetail, problemSubmissions] = await Promise.all([
                leetcodeClient.getProblemDetail(input.titleSlug),
                leetcodeClient.getUserProblemSubmissions(input.titleSlug),
            ]);

            if (!problemDetail) {
                return { success: false, error: "Problem not found" };
            }

            try {
                // Sync problem details and tags
                const problem = await prisma.problem.upsert({
                    where: {
                        titleSlug: input.titleSlug,
                    },
                    update: {
                        title: problemDetail.title,
                        titleSlug: problemDetail.titleSlug,
                        difficulty: problemDetail.difficulty,
                        questionId: problemDetail.questionFrontendId,
                    },
                    create: {
                        title: problemDetail.title,
                        titleSlug: problemDetail.titleSlug,
                        difficulty: problemDetail.difficulty,
                        questionId: problemDetail.questionFrontendId,
                    },
                });

                const tags = await Promise.all(
                    problemDetail.topicTags.map((tag) =>
                        prisma.tag.upsert({
                            where: { slug: tag.slug },
                            update: {},
                            create: {
                                name: tag.name,
                                slug: tag.slug,
                            },
                        }),
                    ),
                );

                await Promise.all(
                    tags.map((tag) =>
                        prisma.problemTag.upsert({
                            where: {
                                problemId_tagId: {
                                    problemId: problem.id,
                                    tagId: tag.id,
                                },
                            },
                            update: {},
                            create: {
                                problemId: problem.id,
                                tagId: tag.id,
                            },
                        }),
                    ),
                );

                // TODO: Sync proficiency

                return {
                    success: true,
                    problem: {
                        ...problem,
                        tags,
                    },
                };
            } catch (error) {
                console.error("Failed to sync problem:", error);

                return {
                    success: false,
                    error: "Failed to sync problem",
                };
            }
        }),
    cancelProblemProficiencyTracking: publicProcedure
        .input(z.object({ titleSlug: z.string() }))
        .mutation(async ({ input }) => {
            const problem = await prisma.problem.findUnique({
                where: { titleSlug: input.titleSlug },
            });

            if (!problem) {
                return { success: false, error: "Problem not found" };
            }

            const existingProficiency = await prisma.proficiency.findUnique({
                where: { problemId: problem.id },
            });

            let updatedProficiency: Proficiency;
            if (!existingProficiency) {
                updatedProficiency = await prisma.proficiency.create({
                    data: {
                        problemId: problem.id,
                        isTracking: false,
                        proficiency: 0,
                        lastSubmissionTime: Date.now().toString(),
                        nextReviewTime: Date.now().toString(),
                    },
                });
            } else {
                updatedProficiency = await prisma.proficiency.update({
                    where: { id: existingProficiency.id },
                    data: { isTracking: false },
                });
            }

            return {
                success: true,
                problem: {
                    ...problem,
                    proficiency: updatedProficiency,
                },
            };
        }),
    resetProblemProficiency: publicProcedure
        .input(z.object({ titleSlug: z.string() }))
        .mutation(async ({ input }) => {
            const problem = await prisma.problem.findUnique({
                where: { titleSlug: input.titleSlug },
            });

            if (!problem) {
                return { success: false, error: "Problem not found" };
            }

            const proficiency = await prisma.proficiency.findUnique({
                where: { problemId: problem.id },
            });

            if (!proficiency) {
                return { success: false, error: "Proficiency not found" };
            }

            const updatedProficiency = await prisma.proficiency.update({
                where: { id: proficiency.id },
                data: {
                    isTracking: true,
                    proficiency: 0,
                    nextReviewTime: Date.now().toString(),
                },
            });

            return {
                success: true,
                problem: {
                    ...problem,
                    proficiency: updatedProficiency,
                },
            };
        }),
    resumeTrackingProblem: publicProcedure
        .input(z.object({ titleSlug: z.string() }))
        .mutation(async ({ input }) => {
            const problem = await prisma.problem.findUnique({
                where: { titleSlug: input.titleSlug },
            });

            if (!problem) {
                return { success: false, error: "Problem not found" };
            }

            const proficiency = await prisma.proficiency.findUnique({
                where: { problemId: problem.id },
            });

            if (!proficiency) {
                return { success: false, error: "Proficiency not found" };
            }

            const updatedProficiency = await prisma.proficiency.update({
                where: { id: proficiency.id },
                data: { isTracking: true },
            });

            return {
                success: true,
                problem: {
                    ...problem,
                    proficiency: updatedProficiency,
                },
            };
        }),
});
