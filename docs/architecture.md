# Architecture

How the Atenews frontend fits together.

## Big picture

```
Browser
  |
  | HTTPS, loads Next.js pages
  v
Next.js (this app, Docker container)
  |
  | 1. SSR / getServerSideProps calls tRPC procedures server-side
  | 2. Client hydration calls tRPC procedures via /api/trpc
  v
tRPC procedures (src/server/routers/*.ts)
  |
  | Each procedure calls one of two backends:
  |
  +---> WPGraphQL (https://wp.atenews.ph/graphql)   most data
  +---> WP REST API (https://wp.atenews.ph/wp-json)  staff list only
  |
  v
WordPress backend (wp.atenews.ph)
```

Everything is read-only from the frontend's point of view. The only write is the view counter increment (see below).

## The three layers

### 1. Pages (`src/pages/*`)

Next.js Pages Router. Each page is a React component. Pages that need data export `getServerSideProps`, which calls a tRPC procedure and passes the result to the component as props.

Example flow for the homepage (`src/pages/index.tsx`):

```ts
export const getServerSideProps = async ({ req, res }) => {
  const caller = createCallerFactory(appRouter)({ req, res });
  const homeResult = await caller.home(); // tRPC procedure
  return { props: homeResult };
};
```

### 2. tRPC procedures (`src/server/routers/*.ts`)

Server-only functions that talk to WordPress. Each procedure:

- Validates input with zod
- Builds a GraphQL query string
- Calls `WPGraphQL.request(query)`
- Returns typed data

The router is assembled in `src/server/routers/_app.ts` and exposed at `/api/trpc/[trpc]`. The client side calls the same procedures via the tRPC client (`src/utils/trpc.ts`).

### 3. WordPress client (`src/utils/wpgraphql.ts`)

A thin wrapper over `fetch()` plus a TanStack Query cache. Sends GraphQL queries as POST to `https://wp.atenews.ph/graphql` with Basic auth. Results are cached for 60 seconds (see [data-fetching.md](./data-fetching.md)).

## Data flow examples

**Homepage loads:**

1. Browser requests `/`
2. `getServerSideProps` in `src/pages/index.tsx` runs on the server
3. It calls `caller.home()` which runs `src/server/routers/home.ts`
4. That sends one GraphQL query to WordPress asking for recent articles, news, features, editorial, columns, featured photo, and SEO head
5. WordPress returns JSON
6. The data is passed as props to the page component
7. Next.js renders HTML and sends it to the browser
8. Client React hydrates and may fetch more (menus, categories) via tRPC

**Article page loads:**

1. Browser requests `/some-article-slug`
2. `getServerSideProps` in `src/pages/[slug].tsx` runs
3. It uses `articleServerSideProps` (`src/utils/serverProps/articleServerSideProps.ts`)
4. That calls `caller.article({ slug })` then `caller.suggestions(...)` for related posts
5. Returns the post, related posts, and categories as props

## Two WordPress APIs

The app uses both WordPress APIs for different things.

| API       | Endpoint   | Used for                                            | File                     |
| --------- | ---------- | --------------------------------------------------- | ------------------------ |
| WPGraphQL | `/graphql` | Articles, categories, menus, pages, search, sitemap | `src/utils/wpgraphql.ts` |
| WP REST   | `/wp-json` | Staff list (custom `atenews/v1/staffs` route)       | `src/utils/wordpress.ts` |

Most data comes through GraphQL. The staff list comes through REST because it uses a custom plugin route that returns roles and avatars in a shape GraphQL does not expose.

See [wordpress-backend.md](./wordpress-backend.md) for what each WordPress thing maps to.

## The only write

`updateViewCount` (`src/server/routers/updateViewCount.ts`) is a tRPC mutation called from the article page after the user reads for a bit. It queries `postViewsAndUpdate` on a post, which WordPress increments server-side. Despite the name, the frontend sends a GraphQL query, not a mutation.

## Styling

Two styling systems run side by side (see [styling.md](./styling.md)):

- `@mui/styles` `makeStyles` for most components (JSS, class names like `makeStyles-container-14`)
- MUI 9 `sx` prop and Emotion for newer code

Both share the same theme (`src/styles/theme.ts`). SSR uses `ServerStyleSheets` from `@mui/styles` in `src/pages/_document.tsx` to inject JSS styles, then removes them on client mount.

## MUI compatibility shims

MUI 9 removed `Hidden` and changed `Grid` v1 to v2. Two shims under `src/components/MUICompat/` translate the old API to the new one so the existing 40+ files do not need rewriting:

- `Grid.tsx` accepts old props (`item`, `xs`, `sm`, `direction="column"`) and maps them to Grid v2 `size` or `Stack`
- `Hidden.tsx` wraps children in a `Box` with responsive `display: contents` (visible) or `display: none` (hidden)

Always import Grid and Hidden from `@/components/MUICompat/Grid` and `@/components/MUICompat/Hidden`, never from `@mui/material`.

## Where state lives

- Server state: tRPC + TanStack Query on the client (cache, refetch, loading states)
- Theme (light/dark): React state in `_app.tsx`, persisted to localforage
- Category list: React context (`src/utils/hooks/useCategory.tsx`)
- Toasts: React context (`src/utils/hooks/useSnackbar.tsx`)
- URL: Next.js router
