import { prisma } from "../../../../prisma/client";
import { publicProcedure, router } from "../../routers/router";

export const problemsRouter = router({
    getProblems: publicProcedure.query(async () => {
        return await prisma.problem.findMany();
    }),
});
