 
import { appRouter } from '@/backend/routers';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';

const handler = ( req: NextRequest ) =>
    fetchRequestHandler( {
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () => ( {} )
    } );

export { handler as GET, handler as POST };