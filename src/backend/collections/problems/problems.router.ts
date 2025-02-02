import type { Problem } from "@prisma/client";
import type { Submission } from "leetcode-query";
import { z } from "zod";

import { getLeetcodeClient } from "@/backend/libs/leetcode";
import { isProblemMastered, isProblemReviewDue } from "@/backend/utils/reviews";
import { ProblemWithProficiencySchema } from "@/shared/types";

import { prisma } from "../../../../prisma/client";
import { publicProcedure, router } from "../../routers/router";
import { buildProficiencyData, shouldUpdateProficiency } from "./helpers";

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

        if (!submissions) {
            return { success: true };
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

        try {
            // Wrap all database operations in a transaction
            await prisma.$transaction(async (tx) => {
                console.log("Starting syncing problems...");

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

                            await tx.proficiency.create({
                                data: buildProficiencyData(problem, submission),
                            });
                        } else {
                            problem = existingProblem;

                            const proficiency = await tx.proficiency.findUnique({
                                where: {
                                    problemId: problem.id,
                                },
                            });

                            if (!proficiency) {
                                await tx.proficiency.create({
                                    data: buildProficiencyData(problem, submission),
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

                                    await tx.proficiency.update({
                                        where: {
                                            id: proficiency.id,
                                        },
                                        data: proficiencyData,
                                    });
                                }
                            }
                        }
                    },
                );

                await Promise.all(submissionPromises);
            });

            return { success: true };
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
