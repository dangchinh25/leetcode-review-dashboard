import { z } from "zod";

const envSchema = z.object({
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_PORT: z.string(),
    POSTGRES_HOST: z.string(),
});

const parsedServerEnv = envSchema.safeParse(process.env);

if (!parsedServerEnv.success) {
    throw new Error(
        `Invalid or missing environment variables:  ${parsedServerEnv.error.errors.join("\n")}`,
    );
}

export const serverEnv = parsedServerEnv.data;
