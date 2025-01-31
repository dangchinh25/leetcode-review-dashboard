import { AppRouter } from '@/backend/routers';
import { NextResponse } from 'next/server';
import { serverClient } from '../_trpc';

const handler = async (): Promise<NextResponse<Awaited<ReturnType<AppRouter['getLiveliness']>>>> => {
    const getLivelinessResult = await serverClient.getLiveliness();

    return NextResponse.json(getLivelinessResult);
};

export { handler as GET };