# Development

Local setup, commands, project layout, and conventions. Assumes a Windows machine. The server runs Linux; see the docs repo's [infrastructure/linux-for-windows-users.md](https://github.com/Atenews/docs/tree/main/infrastructure/linux-for-windows-users.md) for that side.

## Tools to install on your machine

Install these once. All are free.

### 1. Git for Windows

Version control and the Git Bash shell (used for the Linux-style commands in these docs).

Download: https://git-scm.com/download/win

Install with default options. Git Bash comes bundled.

### 2. Bun

The package manager and runtime. Replaces npm, yarn, and (for this project) Node for running commands.

Install via PowerShell (Start menu > PowerShell):

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

Or see the official Windows install options: https://bun.sh/docs/installation#windows

Verify:

```bash
bun --version
```

### 3. A code editor

[Visual Studio Code](https://code.visualstudio.com/) is the usual pick and is free. Any editor works.

Recommended VS Code extensions (optional but helpful):

- ESLint
- Prettier
- TypeScript

### 4. Node.js (optional)

You do NOT need Node for this project. Bun handles installs, builds, and the dev server. Install Node 20+ only if a tool you add later complains it is missing. https://nodejs.org/

### 5. The GitHub CLI (optional, convenient)

For creating pull requests and other GitHub tasks from the command line: https://cli.github.com/

## Get the WP_API_TOKEN from Bitwarden

The frontend reads content from WordPress and needs a `WP_API_TOKEN` to authenticate. The token lives in the shared Bitwarden vault. Copy it from there before the next step. Do not ask anyone to send it over chat or email. See the docs repo's [secrets-and-2fa.md](https://github.com/Atenews/docs/tree/main/secrets-and-2fa.md) if you do not yet have vault access.

## First run

Open Git Bash (Start menu > Git Bash) and run:

```bash
git clone https://github.com/Atenews/atenews-frontend.git
cd atenews-frontend
git checkout dev          # work on dev, not prod
bun install
cp .env.example .env      # then fill in WP_API_TOKEN
bun run dev
```

Open `.env` in your editor and paste the `WP_API_TOKEN` value from Bitwarden:

```
WP_API_TOKEN=<paste from Bitwarden>
```

Then run the dev server:

```bash
bun run dev
```

Open http://localhost:3000. The dev server uses Turbopack and hot reloads on save.

If the homepage loads but data is missing, your `WP_API_TOKEN` is wrong or empty. The tRPC endpoint will return auth errors from WordPress.

## Commands

| Command            | Does                                                                   |
| ------------------ | ---------------------------------------------------------------------- |
| `bun run dev`      | Dev server with hot reload                                             |
| `bun run build`    | Production build. Output goes to `.next/standalone`                    |
| `bun run start`    | Run via `next start` (does not work with standalone output; see below) |
| `bun run lint`     | ESLint                                                                 |
| `bun run lint:fix` | ESLint with auto fix                                                   |
| `npx tsc --noEmit` | Type check without emitting                                            |

To run the standalone build locally (matches what Docker runs):

```bash
bun run build
cd .next/standalone
PORT=3000 bun server.js
```

## Project layout

```
atenews-frontend/
  src/
    components/        React components grouped by area
      ArticlePage/     Single article view and its pieces
      Home/            Homepage sections (ArticleGrid, RecentArticles, etc.)
      Layout/          Header, Footer, nav, mobile bar
      List/            Category listing cards
      MUICompat/       Grid and Hidden shims (see styling.md)
      Profile/         Author profile (legacy)
      Staff/           Staff directory cards
      General/         Link, Tag, LoadingPage
    pages/             Next.js routes (see pages-and-routes.md)
      api/             API routes (tRPC, sitemap)
      category/        Category listing routes
      news/ features/ opinion/ photos/   Article redirects
    server/
      routers/         tRPC procedures (see data-fetching.md)
      trpc.ts          tRPC context and init
    styles/
      theme.ts         MUI theme generator
    utils/
      wpgraphql.ts     GraphQL client + gql tag + TanStack cache
      wordpress.ts     WP REST client (staff)
      trpc.ts          tRPC client (browser side)
      hooks/           React context hooks (useCategory, useSnackbar)
      serverProps/     getServerSideProps factories
      *.ts             Small helpers (imageGenerator, slugGenerator, etc.)
    types live in custom.d.ts (global) and theme.d.ts
  public/              Static assets (icons, manifest, logo SVGs)
  docs/                This documentation
  .github/workflows/   CI/CD
  Dockerfile           Multi-stage build
  next.config.ts       Next.js config (standalone output)
  package.json
  bun.lock             Use bun, not npm or yarn
```

## Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`). Always import with the alias:

```ts
import WPGraphQL from '@/utils/wpgraphql';
import Grid from '@/components/MUICompat/Grid';
```

## Global types

`custom.d.ts` declares global types used everywhere without imports:

- `Article`, `Author`, `Category`, `Staff`, `Menu`
- Module declarations for `wpapi` and `@n8tb1t/use-scroll-position` (no bundled types)

`theme.d.ts` extends the MUI palette with the `atenews` brand colors.

## Conventions

- Use the MUICompat shims for Grid and Hidden. Never import them from `@mui/material`.
- Use `makeStyles` from `@mui/styles` for existing-style components, or `sx` for new code. Both share the theme.
- All server data access goes through tRPC procedures. Do not call `fetch` or `WPGraphQL` directly from components. Add a procedure in `src/server/routers/` and register it in `_app.ts`.
- Validate procedure input with zod.
- Use `getServerSideProps` for page data. Use the tRPC client (`trpc.foo.useQuery`) for client-side data and mutations.
- Commit `bun.lock`, never `package-lock.json` or `pnpm-lock.yaml`.
- Do not commit `.env`. It is gitignored.
- `next-env.d.ts` is generated by Next. Do not edit it manually.

## Working with the WordPress backend

You do not need WordPress running locally. The frontend talks to the live `wp.atenews.ph`. To test against a different backend, change the endpoint in `src/utils/wpgraphql.ts` and `src/utils/wordpress.ts`.

To add or change WordPress content, log into https://wp.atenews.ph/wp-admin/. See [wordpress-backend.md](./wordpress-backend.md).

## Debugging tRPC

Server-side tRPC errors surface in two places:

1. The terminal running `bun run dev` (look for `tRPC failed on <path>:` lines)
2. The response from `/api/trpc/<procedure>` (JSON with `error.json.message`)

Client-side errors come through the tRPC hook (`error` field).

To call a procedure directly for testing:

```bash
curl 'http://localhost:3000/api/trpc/menus'
curl 'http://localhost:3000/api/trpc/home'
```

## Formatting and linting

Prettier config is in `.prettierrc`. The project uses tabs for indentation. ESLint config is in `eslint.config.mjs` (flat config, ESLint 10).

Note: the legacy `.eslintignore` file still exists. ESLint 10 wants ignores in the flat config. If `bun run lint` complains, remove `.eslintignore` and move its contents into the `ignores` array in `eslint.config.mjs`.

## Common tasks

### Add a new page

1. Create `src/pages/<route>.tsx`
2. If it needs server data, export `getServerSideProps` that calls a tRPC procedure
3. Add any new procedures to `src/server/routers/`

### Add a new tRPC procedure

See the end of [data-fetching.md](./data-fetching.md).

### Add a new category section to the homepage

See [wordpress-backend.md](./wordpress-backend.md) under "Add a new section to the homepage".

### Change brand colors

Edit `src/styles/theme.ts` (`palette.atenews`) and `theme.d.ts` if you add a new key.
