# Troubleshooting

Common errors and fixes. Ordered by how likely you are to hit them.

## tRPC returns 500 with "cannot be accessed without authentication"

```
The field "RootQuery.menu" cannot be accessed without authentication.
```

Cause: `NEXT_PUBLIC_WEB_WP_API` is empty or wrong. The GraphQL request reaches WordPress but has no valid Basic auth header.

Fix:

- Check `.env` has `NEXT_PUBLIC_WEB_WP_API` set to the base64 of `username:application password`
- Restart the dev server (Next.js reads `.env` at startup)
- For Docker: confirm `.env` is not in `.dockerignore` and is present at build time. The token is inlined into the bundle during `bun run build`

## ERR_MODULE_NOT_FOUND for graphql/index.mjs in Docker

```
Failed to load external module ... : Cannot find module '.../graphql/index.mjs'
imported from .../@apollo/client/core/ApolloClient.js
```

or the same error mentioning `graphql-request`.

Cause: the `graphql` npm package ships dual ESM/CJS. Next.js standalone output traces only the CJS `index.js`, but externalized ESM importers resolve to `index.mjs` at runtime.

This should not happen anymore. The app uses plain `fetch` in `src/utils/wpgraphql.ts` and does not depend on `graphql`, `graphql-request`, or `@apollo/client` at runtime. If you see this error, someone added one of those packages back.

Fix:

- Check `package.json` does not list `graphql`, `graphql-request`, or `@apollo/client`
- Check `src/utils/wpgraphql.ts` still uses `fetch` and the local `gql` tag
- Reinstall with `bun install` and rebuild

## Hydration mismatch errors in the browser

```
Hydration failed because the server rendered HTML didn't match the client.
```

Common causes and fixes:

- **Header / Navigation / RightBar / MobileBar differ between server and client**: these are dynamically imported with `{ ssr: false }` in `src/components/Layout/Header.tsx`. If you remove the `{ ssr: false }`, the mismatch returns because they use router and media query state that differs server vs client.
- **JSS class names differ**: the server renders `makeStyles-foo-14` and the client renders a different number. The `_document.tsx` SSR setup with `ServerStyleSheets` should prevent this. If it returns, check `_document.tsx` still wraps the app render in `sheets.collect(<App ... />)`.
- **`darkMode` flashes**: the server always renders light mode, then the client applies the saved dark preference. This is expected and handled by `suppressHydrationWarning` on `<body>`. Do not read dark mode during render.

## Hero images have zero size on the homepage

Cause: a `Hidden` wrapper broke the Grid flex layout, or Grid items got the wrong `size`.

Fix:

- `Hidden` in `src/components/MUICompat/Hidden.tsx` must use `display: contents` when visible (not `display: block`). A block wrapper becomes the flex child and starves the inner Grid item.
- Grid items with no size prop must NOT get `size: 'grow'`. Check `src/components/MUICompat/Grid.tsx` passes `size={hasSize ? sizeObj : undefined}`.

## Mobile bottom navbar shows on desktop

Cause: the `Hidden mdUp` wrapper around `BottomNavigation` in `src/components/Layout/Layout.tsx` is not hiding.

Fix: `Hidden` must wrap ALL its children in one `Box` with responsive `display`. If it only styles the first child (old cloneElement approach), the navbar leaks through. The current `Box sx={{ display: displayMap }}` approach handles multiple children correctly.

## Grid layout looks wrong (items too wide, too narrow, or wrapped wrong)

Cause: a Grid v1 to v2 translation mismatch.

Check the Grid shim rules in [styling.md](./styling.md):

- `<Grid item>` with no size should be natural width (no `size` prop)
- `<Grid item xs={6}>` should map to `size={{ xs: 6 }}`
- `<Grid item xs>` (boolean true) should map to `size={{ xs: 'grow' }}`
- `<Grid container>` should have `width: 100%`
- `<Grid direction="column">` should render a `Stack`

If a layout is broken, compare the rendered DOM classes and computed `flex-basis` / `flex-grow` against the production site (atenews.ph) which runs the same components on the old MUI.

## Empty href warnings

```
An empty string ("") was passed to the href attribute.
```

Cause: a `Link` renders with an empty `href` before data loads. Non-blocking. Fix by guarding the render (`{article.slug && <Link href={...}>}`) or accepting the warning.

## "legacyBehavior is deprecated" warning

Cause: `next/link` `Link` with `legacyBehavior` and a child `<a>`. Non-blocking in Next 16.

Fix for new code: drop `legacyBehavior`, put the `<a>` props directly on `Link`:

```tsx
// old
<Link href="/x" legacyBehavior><a className="...">text</a></Link>

// new
<Link href="/x" className="...">text</Link>
```

## "next start does not work with output: standalone"

```
"next start" does not work with "output: standalone" configuration.
Use "node .next/standalone/server.js" instead.
```

This is expected. `bun run start` runs `next start` which does not support standalone. To run the production build locally:

```bash
cd .next/standalone
PORT=3000 node server.js
```

## Lint fails with ".eslintignore is no longer supported"

Cause: ESLint 10 moved ignores into the flat config.

Fix: delete `.eslintignore` and add its entries to the `ignores` array in `eslint.config.mjs`:

```js
ignores: ['build/', 'node_modules/', '.next/', 'public/'],
```

## Port 3000 already in use

Cause: another process (or a leftover `node server.js`) holds the port.

Fix:

```bash
pkill -f "next"
pkill -f "server.js"
# or find and kill by port
lsof -ti:3000 | xargs kill
```

## Changes not showing after a Docker deploy

Cause: browser cache, CDN cache, or the GraphQL cache (60 second TTL).

Fix:

- Hard refresh the browser (Ctrl+Shift+R)
- Wait 60 seconds for the GraphQL cache to expire
- Confirm the new image actually deployed (check the GitHub Actions run and the container start time)

## WordPress content not showing up

New posts should appear within 60 seconds (the TanStack Query cache TTL in `src/utils/wpgraphql.ts`). If they do not:

- Check the post is published (not draft) in WordPress
- Check the post is in a category the frontend reads (see [wordpress-backend.md](./wordpress-backend.md))
- Call the tRPC endpoint directly to see what comes back: `curl 'http://localhost:3000/api/trpc/home'`

## Build fails after dependency changes

If `bun run build` fails after adding or upgrading a package:

1. Run `bun install` to sync `bun.lock`
2. Run `npx tsc --noEmit` to find type errors
3. Check if the new package has ESM/CJS issues (see the graphql error above)
4. If the package must stay external in the standalone build, add it to `serverExternalPackages` in `next.config.ts`

## Contact

For access to the WordPress admin, the server, or the `.env` values, ask a current Atenews developer. This repo only contains the frontend code.
