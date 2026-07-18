import { initTRPC } from '@trpc/server';
import type { IncomingMessage, ServerResponse } from 'http';
import superjson from 'superjson';

export const createContext = async ({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}) => ({
  req,
  res,
});

type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
