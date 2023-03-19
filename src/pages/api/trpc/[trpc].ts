import { createContext } from '@/server/trpc';
import { appRouter } from '@/server/routers/_app';
import * as trpcNext from '@trpc/server/adapters/next';

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  responseMeta({
    ctx, type, errors, // paths,
  }) {
    // assuming you have all your public routes with the keyword `public` in them
    // const allPublic = paths && paths.every((path) => path.includes('public'));
    // checking that no procedures errored
    const allOk = errors.length === 0;
    // checking we're doing a query request
    const isQuery = type === 'query';
    if (ctx?.res && allOk && isQuery) {
      // cache request for 1 day + revalidate once every second
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
