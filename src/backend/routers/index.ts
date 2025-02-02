import type { inferRouterOutputs } from "@trpc/server";

import { livelinessRouter } from "../collections/liveliness";
import { problemsRouter } from "../collections/problems";
import { mergeRouters } from "./router";

export const appRouter = mergeRouters(livelinessRouter, problemsRouter);

export type RouterOutputs = inferRouterOutputs<typeof appRouter>;

export type AppRouter = typeof appRouter;
