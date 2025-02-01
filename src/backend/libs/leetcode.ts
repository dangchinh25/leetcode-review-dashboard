import { LeetCode, Problem, RecentSubmission } from 'leetcode-query';

export class LeetCodeClient {
  private client: LeetCode;

  constructor() {
    this.client = new LeetCode();
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

  async getUserRecentSubmissions(username: string, limit = 10): Promise<RecentSubmission[] | null> {
    try {
      const submissions = await this.client.recent_submissions(username);
      return submissions.slice(0, limit);
    } catch (error) {
      console.error(`Error fetching recent submissions for ${username}:`, error);
      return null;
    }
  }
}

// Create a singleton instance
export const leetcodeClient = new LeetCodeClient(); 