# Data fetching

How the frontend reads data from WordPress. There are three things to know: tRPC procedures, the GraphQL client, and the cache.

## tRPC procedures

All data access goes through tRPC. Each procedure is a server-only function in `src/server/routers/`. They are assembled into one router in `src/server/routers/_app.ts`:

```ts
export const appRouter = router({
  home,
  article,
  articles,
  authorArticles,
  category,
  categories,
  menus,
  search,
  suggestions,
  customPage,
  siteMap,
  staff,
  updateViewCount,
});
```

A procedure is either a `.query` (read) or `.mutation` (write). All of them are `publicProcedure`, meaning no auth check. Input is validated with zod.

Example (`src/server/routers/article.ts`):

```ts
const handler = publicProcedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ input: { slug } }) => {
    const data = await WPGraphQL.request<Query>(
      gql`query Article { post(id: "${slug}", idType: SLUG) { ... } }`,
    );
    return data.post;
  });
```

## How procedures are called

Two ways, same procedures.

### Server side (SSR)

`getServerSideProps` creates a caller from the request and awaits procedures directly. No HTTP involved.

```ts
const caller = createCallerFactory(appRouter)({ req, res });
const post = await caller.article({ slug });
```

Used in:

- `src/pages/index.tsx` (home)
- `src/utils/serverProps/articleServerSideProps.ts` (article pages)
- `src/utils/serverProps/listServerSideProps.ts` (category pages)
- `src/pages/staff.tsx`
- `src/pages/api/posts-sitemap.ts`

### Client side

The tRPC client (`src/utils/trpc.ts`) calls the same procedures over HTTP via `/api/trpc/[trpc]`. Built on TanStack Query, so hooks return `{ data, isLoading, error }` and cache across renders.

```ts
const menusQuery = trpc.menus.useQuery();
const articleViewCount = trpc.updateViewCount.useMutation();
```

tRPC client config (`src/utils/trpc.ts`):

- `ssr: false` (no SSR prefetch from the client wrapper; SSR data comes through `getServerSideProps` instead)
- `httpBatchLink` batches multiple calls into one request
- `superjson` transformer on both ends so Dates and other types survive

## The GraphQL client

`src/utils/wpgraphql.ts`. Not Apollo, not graphql-request. It is plain `fetch` wrapped in a TanStack Query `QueryClient`.

```ts
const WPGraphQL = {
  request: async <T>(query: string, variables?) => {
    return queryClient.fetchQuery({
      queryKey: ['wp-graphql', query, variables],
      queryFn: async () => {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Basic ${token}`,
          },
          body: JSON.stringify({ query, variables }),
        });
        const json = await res.json();
        if (json.errors) throw new Error(json.errors[0].message);
        return json.data;
      },
    });
  },
};
```

Why not Apollo or graphql-request: both pull in the `graphql` npm package, which ships dual ESM/CJS files. Next.js standalone output traces only the CJS file, so the ESM import fails at runtime in Docker. Plain `fetch` sends the query string as-is with no runtime parser, so nothing breaks. See [troubleshooting.md](./troubleshooting.md) for the full story.

### The `gql` tag

`gql` is exported from `src/utils/wpgraphql.ts`. It is a template literal collector that joins the string parts. It does NOT parse anything. It only exists so multi-line queries read nicely:

```ts
import WPGraphQL, { gql } from '@/utils/wpgraphql';

const data = await WPGraphQL.request<Query>(
  gql`
    query Home {
      posts(first: 5) { nodes { ... } }
    }
  `,
);
```

Every router imports `gql` from `@/utils/wpgraphql`. Do not import `gql` from `graphql-request` or `@apollo/client`. Those packages are not installed.

## The cache

The `QueryClient` in `wpgraphql.ts` is module-level, so it lives for the lifetime of the server process and is shared across requests.

Defaults:

| Option      | Value      | Meaning                                                                                                    |
| ----------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| `staleTime` | 60 seconds | A result is fresh for 1 minute. Calls within that window return the cached value without hitting WordPress |
| `gcTime`    | 5 minutes  | Unused cache entries are garbage collected after 5 minutes                                                 |
| `retry`     | 1          | One retry on failure                                                                                       |

Effects:

- The same query called twice within 60 seconds hits WordPress once
- A burst of traffic to the homepage does not hammer WordPress
- New posts show up within 1 minute of publishing

If you need fresh data for a specific call, change the `queryKey` or bypass the cache by calling `fetch` directly.

## Cursor-based pagination

List endpoints (articles, search, authorArticles, suggestions) use WordPress cursor pagination. The frontend passes an `after` cursor and gets back `pageInfo`:

```ts
{
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  }
}
```

The client stores `endCursor` and passes it as `cursor` on the next call to load more. See `src/components/List/Article.tsx` and the infinite scroll usage.

## The WP REST client

`src/utils/wordpress.ts` uses the `wpapi` npm package to hit `/wp-json`. Only used for staff:

```ts
import WPAPI from 'wpapi';
const wp = new WPAPI({ endpoint: 'https://wp.atenews.ph/wp-json' });
wp.staffs = wp.registerRoute('atenews/v1', '/staffs');

const staffs = await wp.staffs();
```

No cache layer here. Each call hits WordPress. Only the staff page uses it.

## Adding a new data source

To add a new query:

1. Create `src/server/routers/yourThing.ts`:

   ```ts
   import { z } from 'zod';
   import { publicProcedure } from '@/server/trpc';
   import WPGraphQL, { gql } from '@/utils/wpgraphql';

   export interface Query {
     /* shape of the GraphQL response */
   }

   const handler = publicProcedure
     .input(z.object({ id: z.number() }))
     .query(async ({ input: { id } }) => {
       const data = await WPGraphQL.request<Query>(
         gql`query Thing { thing(id: ${id}) { ... } }`,
       );
       return data.thing;
     });

   export default handler;
   ```

2. Register it in `src/server/routers/_app.ts`:

   ```ts
   import yourThing from './yourThing';
   export const appRouter = router({ ..., yourThing });
   ```

3. Call it from a page or component:

   ```ts
   // server side
   const thing = await caller.yourThing({ id: 1 });

   // client side
   const { data } = trpc.yourThing.useQuery({ id: 1 });
   ```

The TypeScript types flow from the router definition. No codegen step.
