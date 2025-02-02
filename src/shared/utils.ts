import { LEETCODE_PROBLEM_PREFIX } from "./constants";

export const getLeetcodeProblemUrl = (problemSlug: string) => {
    return `${LEETCODE_PROBLEM_PREFIX}/${problemSlug}`;
};
