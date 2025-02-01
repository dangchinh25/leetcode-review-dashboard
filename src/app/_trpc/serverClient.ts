import { httpBatchLink } from "@trpc/client";

import { appRouter } from "@/backend/routers";

import { getBaseUrl } from "./utils";

export const serverClient = appRouter.createCaller({
    links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
});
