import superjson from "superjson";

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
