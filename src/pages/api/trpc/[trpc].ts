import { createContext } from '@/server/trpc';
import { appRouter } from '@/server/routers/_app';
import { createNextApiHandler } from '@trpc/server/adapters/next';

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error, path }) {
    console.error(`❌ tRPC failed on ${path}:`, error.message);
  },
  responseMeta({ ctx, type, errors }) {
    const allOk = errors.length === 0;
    const isQuery = type === 'query';
    if (ctx?.res && allOk && isQuery) {
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
      return {
        headers: {
          'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        },
      };
    }
    return {};
  },
});
