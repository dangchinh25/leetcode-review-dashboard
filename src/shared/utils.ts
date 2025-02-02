import superjson from "superjson";

import { LEETCODE_PROBLEM_PREFIX } from "./constants";

export const getLeetcodeProblemUrl = (problemSlug: string) => {
    return `${LEETCODE_PROBLEM_PREFIX}/${problemSlug}`;
};

/**
 * Formats an object as a nicely indented JSON string.
 *
 * @param {unknown} object - The object to be formatted.
 * @returns {string} - The formatted JSON string.
 */
export const jsonfmt = (object: unknown): string => {
    const { json } = superjson.serialize(object);

    return JSON.stringify(json, null, 2);
};
