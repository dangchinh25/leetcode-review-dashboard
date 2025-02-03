import type { Problem, Proficiency } from "@prisma/client";
import type { Submission } from "leetcode-query";
import { z } from "zod";

import { getLeetcodeClient } from "@/backend/libs/leetcode";
import { isProblemMastered, isProblemReviewDue } from "@/backend/utils/reviews";
import type { ProblemWithProficiency } from "@/shared/types";
import { ProblemWithProficiencyTagsSchema } from "@/shared/types";

import { prisma } from "../../../../prisma/client";
import { publicProcedure, router } from "../../routers/router";
import { buildProficiencyData, shouldUpdateProficiency } from "./helpers";

const ProblemsWithReviewStatusSchema = z.object({
    reviewDue: z.array(ProblemWithProficiencyTagsSchema),
    reviewScheduled: z.array(ProblemWithProficiencyTagsSchema),
    mastered: z.array(ProblemWithProficiencyTagsSchema),
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
        };

        for (const problem of problemWithProficiency) {
            if (!problem.proficiency) {
                continue;
            }

            if (isProblemMastered(problem.proficiency)) {
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
                                    questionId: problemDetails.questionId,
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
});
