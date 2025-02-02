import type { TopicTag } from "leetcode-query";

import { prisma } from "../../../prisma/client";
import { leetcodeClient } from "../libs/leetcode";
import seedData from "./seedData.json";

const getProblemSlugFromUrl = (url: string) => {
    const slugWithParams = url.split("/problems/")[1];
    const slug = slugWithParams.split("?")[0];
    return slug.replace("/", "");
};

const main = async () => {
    console.log("Starting seed...");

    try {
        await prisma.$transaction(
            async (tx) => {
                // Clear existing data
                await tx.proficiency.deleteMany();
                await tx.problemTag.deleteMany();
                await tx.tag.deleteMany();
                await tx.problem.deleteMany();

                console.log("Fetching problem details...", new Date().toISOString());
                // Fetch all problem details in parallel
                const problemDetailsPromises = Object.entries(seedData).map(
                    async ([questionId, data]) => {
                        const problemSlug = getProblemSlugFromUrl(data.url);
                        const problemDetail = await leetcodeClient.getProblemDetail(problemSlug);
                        if (!problemDetail) {
                            throw new Error(`Could not fetch details for problem ${problemSlug}`);
                        }
                        return {
                            questionId,
                            data,
                            problemDetail,
                        };
                    },
                );

                const problemDetails = await Promise.all(problemDetailsPromises);
                console.log(
                    "Fetching problem details... done",
                    `(${problemDetails.length} problems)`,
                    new Date().toISOString(),
                );

                console.log(
                    "Creating problems...",
                    `(${problemDetails.length} problems)`,
                    new Date().toISOString(),
                );
                // Create all problems in parallel
                const problems = await Promise.all(
                    problemDetails.map(({ questionId, problemDetail }) =>
                        tx.problem.create({
                            data: {
                                questionId,
                                title: problemDetail.title,
                                titleSlug: problemDetail.titleSlug,
                                difficulty: problemDetail.difficulty,
                            },
                        }),
                    ),
                );

                console.log(
                    "Creating problems... done",
                    `(${problems.length} problems)`,
                    new Date().toISOString(),
                );

                // Create all unique tags first
                const uniqueTags = new Map<string, TopicTag>();
                problemDetails.forEach(({ problemDetail }) => {
                    problemDetail.topicTags.forEach((tag) => {
                        uniqueTags.set(tag.slug, tag);
                    });
                });

                console.log(
                    "Creating tags... ",
                    `(${uniqueTags.size} tags)`,
                    new Date().toISOString(),
                );
                const tags = await Promise.all(
                    Array.from(uniqueTags.values()).map((tag) =>
                        tx.tag.upsert({
                            where: { slug: tag.slug },
                            update: {},
                            create: {
                                name: tag.name,
                                slug: tag.slug,
                            },
                        }),
                    ),
                );
                console.log(
                    "Creating tags... done",
                    `(${tags.length} tags)`,
                    new Date().toISOString(),
                );

                // Create a map of tag slugs to tag records for quick lookup
                const tagMap = new Map(tags.map((tag) => [tag.slug, tag]));

                console.log(
                    "Creating problem-tag relationships and proficiency records...",
                    `(${problemDetails.length} problems)`,
                    new Date().toISOString(),
                );
                // Create all problem-tag relationships and proficiency records in parallel
                await Promise.all(
                    problemDetails.flatMap(({ problemDetail, data }, index) => {
                        const problem = problems[index];
                        const problemTags = problemDetail.topicTags.map((tag) =>
                            tx.problemTag.create({
                                data: {
                                    problemId: problem.id,
                                    tagId: tagMap.get(tag.slug)!.id,
                                },
                            }),
                        );

                        const proficiency = tx.proficiency.create({
                            data: {
                                problemId: problem.id,
                                proficiency: data.proficiency,
                                lastSubmissionTime: data.submissionTime.toString(),
                                nextReviewTime: data.modificationTime.toString(),
                            },
                        });

                        return [...problemTags, proficiency];
                    }),
                );

                console.log("Seed completed successfully");
            },
            { timeout: 999999 },
        );
    } catch (error) {
        console.error("Error during seed:", error);
        throw error; // Re-throw to trigger process.exit(1)
    }
};

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(() => {
        prisma.$disconnect().catch((e) => {
            console.error("Error during disconnection:", e);
        });
    });
