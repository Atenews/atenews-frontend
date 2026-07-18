# Pages and routes

URL structure and which component handles each route. Uses Next.js Pages Router.

## Routes

| URL                      | File                                  | What it shows                    |
| ------------------------ | ------------------------------------- | -------------------------------- |
| `/`                      | `src/pages/index.tsx`                 | Homepage                         |
| `/staff`                 | `src/pages/staff.tsx`                 | Staff directory                  |
| `/search`                | `src/pages/search.tsx`                | Search results                   |
| `/terms-and-conditions`  | `src/pages/terms-and-conditions.tsx`  | Static page from WordPress       |
| `/privacy-policy`        | `src/pages/privacy-policy.tsx`        | Static page from WordPress       |
| `/404`                   | `src/pages/404.tsx`                   | Not found                        |
| `/[slug]`                | `src/pages/[slug].tsx`                | A single article (catch-all)     |
| `/news/[slug]`           | `src/pages/news/[slug].tsx`           | Redirects to `/[slug]`           |
| `/features/[slug]`       | `src/pages/features/[slug].tsx`       | Redirects to `/[slug]`           |
| `/opinion/[slug]`        | `src/pages/opinion/[slug].tsx`        | Redirects to `/[slug]`           |
| `/photos/[slug]`         | `src/pages/photos/[slug].tsx`         | Redirects to `/[slug]`           |
| `/category/[main]`       | `src/pages/category/[main]/index.tsx` | Category listing                 |
| `/category/[main]/[sub]` | `src/pages/category/[main]/[sub].tsx` | Sub-category listing             |
| `/profile/[username]`    | `src/pages/profile/[username].tsx`    | Author profile (legacy, may 404) |

## Article URLs

All articles live at `/<slug>` regardless of category. The `/news/`, `/features/`, `/opinion/`, `/photos/` paths are permanent redirects to the flat URL, kept for backwards compatibility with old links.

Each redirect file is identical:

```ts
export const getServerSideProps = async (ctx) => ({
  redirect: { destination: `/${ctx.params?.slug}`, permanent: true },
});
```

The article page component is in `src/components/ArticlePage/index.tsx`.

## Category URLs

`/category/<main>` and `/category/<main>/<sub>` both use `listServerSideProps` (`src/utils/serverProps/listServerSideProps.ts`):

1. Look up the category by slug to get its `databaseId`
2. Call `articles({ category: databaseId })` to get the first page
3. Render `src/components/ArchiveLayout.tsx`

Infinite scroll on the listing calls `articles({ category, cursor })` to load more.

## API routes

| URL                  | File                             | What it does                   |
| -------------------- | -------------------------------- | ------------------------------ |
| `/api/trpc/[trpc]`   | `src/pages/api/trpc/[trpc].ts`   | tRPC endpoint (all procedures) |
| `/api/posts-sitemap` | `src/pages/api/posts-sitemap.ts` | XML sitemap                    |

The sitemap pulls every post slug and nav URL and writes them as a `sitemap` package `SitemapStream`.

## Special files

| File                      | Role                                                          |
| ------------------------- | ------------------------------------------------------------- |
| `src/pages/_app.tsx`      | Wraps every page with providers (theme, tRPC, layout, toasts) |
| `src/pages/_document.tsx` | Custom HTML shell. Injects Emotion and JSS styles for SSR     |
| `src/pages/_error.tsx`    | Error page                                                    |

## Layout wrapper

`src/components/Layout/Layout.tsx` wraps every page via `_app.tsx`. It renders:

- `Header` (logo, nav, search, dark mode toggle)
- The page content (passed as children)
- `Footer`
- Mobile bottom navigation (hidden on desktop)

Two width modes based on the current URL:

- `homeContainer` (wider): homepage, top-level category pages, search
- `contentContainer` (narrower): article pages, everything else

The mode is picked in `Layout.tsx` by checking `router.asPath` against a list.

## Dynamic imports

Some components are loaded with `next/dynamic` to defer rendering or skip SSR:

- `src/components/Layout/Header.tsx` imports `Navigation`, `RightBar`, `MobileBar` with `{ ssr: false }` (they use router and media queries that differ between server and client)
- `src/pages/index.tsx` dynamically imports `Title`, `ArticleGrid`, `EditorialColumn`, `Hulagway`, `LatestRelease` (lazy loaded below the fold)

## Linking

Use the `next/link` `Link` component for internal links. Many existing links use `legacyBehavior` with a child `<a>`, which is deprecated in Next 16 but still works. New code should drop `legacyBehavior` and put the `<a>` props directly on `Link`.

For styled links the app often wraps `next/link` in `src/components/General/Link.tsx`.
