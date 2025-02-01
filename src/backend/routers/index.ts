import { livelinessRouter } from "../collections/liveliness";
import { mergeRouters } from "./router";

export const appRouter = mergeRouters(livelinessRouter);

export type AppRouter = typeof appRouter;
