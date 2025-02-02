import type { Problem, Submission } from "leetcode-query";
import { Credential, LeetCode } from "leetcode-query";

import { serverEnv } from "@/shared/serverEnv";

export class LeetCodeClient {
    private client: LeetCode;

    constructor(credential: Credential) {
        this.client = new LeetCode(credential);
    }

    async getProblemDetail(titleSlug: string): Promise<Problem | null> {
        try {
            const problem = await this.client.problem(titleSlug);
            return problem;
        } catch (error) {
            console.error(`Error fetching problem details for ${titleSlug}:`, error);
            return null;
        }
    }

    async getUserRecentSubmissions(limit = 10): Promise<Submission[] | null> {
        try {
            const submissions = await this.client.submissions({
                limit,
                offset: 0,
            });

            return submissions.slice(0, limit);
        } catch (error) {
            console.error(`Error fetching recent submissions`, error);
            return null;
        }
    }

    async getUserProblemSubmissions(titleSlug: string): Promise<Submission[] | null> {
        try {
            const submissions = await this.client.submissions({ slug: titleSlug });
            return submissions;
        } catch (error) {
            console.error(`Error fetching recent submissions`, error);
            return null;
        }
    }
}

export const getLeetcodeClient = async () => {
    const credential = new Credential();
    await credential.init(serverEnv.LEETCODE_SESSION_COOKIE);

    return new LeetCodeClient(credential);
};
