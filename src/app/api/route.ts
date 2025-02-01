import { NextResponse } from "next/server";

import type { AppRouter } from "@/backend/routers";

import { serverClient } from "../_trpc";

const handler = async (): Promise<
    NextResponse<Awaited<ReturnType<AppRouter["getLiveliness"]>>>
> => {
    const getLivelinessResult = await serverClient.getLiveliness();

    return NextResponse.json(getLivelinessResult);
};

export { handler as GET };
