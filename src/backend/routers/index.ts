import { livelinessRouter } from "../collections/liveliness";
import { problemsRouter } from "../collections/problems";
import { mergeRouters } from "./router";

export const appRouter = mergeRouters(livelinessRouter, problemsRouter);

export type AppRouter = typeof appRouter;
