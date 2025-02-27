export const FORGETTING_CURVE = [
    1 * 24 * 60, // 1 day
    2 * 24 * 60, // 2 day
    4 * 24 * 60, // 4 day
    7 * 24 * 60, // 7 day
    15 * 24 * 60, // 15 day
] as const;

export const LEETCODE_PROBLEM_PREFIX = "https://leetcode.com/problems";
export const LEETCODE_SUBMISSION_FETCH_LIMIT = 50;
