// This code creates an instance of a trpc server and
// returns the router and procedure helper functions.
// The router is used to create trpc endpoints.
// The procedure helper is used to create trpc procedures.

import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import type { IncomingMessage, ServerResponse } from 'http';
import * as trpcNext from '@trpc/server/adapters/next';
import superjson from 'superjson';

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions): Promise<{
  req?: IncomingMessage;
  res?: ServerResponse;
}> => ({
  req,
  res,
});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Base router and procedure helpers
export const { router } = t;
export const { procedure } = t;
export const { createCallerFactory } = t;
