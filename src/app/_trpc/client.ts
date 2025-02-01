import type { AppRouter } from '@/backend/routers';
import { createTRPCReact } from '@trpc/react-query';

export const trpcClient = createTRPCReact<AppRouter>();