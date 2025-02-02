import { z } from "zod";

import { jsonfmt } from "./utils";

const envSchema = z.object({
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_PORT: z.string(),
    POSTGRES_HOST: z.string(),
    LEETCODE_SESSION_COOKIE: z.string(),
});

const parsedServerEnv = envSchema.safeParse(process.env);

if (!parsedServerEnv.success) {
    throw new Error(
        `Invalid or missing environment variables:  ${jsonfmt(parsedServerEnv.error.format())}`,
    );
}

export const serverEnv = parsedServerEnv.data;
