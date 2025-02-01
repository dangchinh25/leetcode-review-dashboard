import { publicProcedure, router } from "@/backend/routers/router";

export const livelinessRouter = router({
    getLiveliness: publicProcedure.query(async () => {
        return { liveliness: true };
    }),
});
