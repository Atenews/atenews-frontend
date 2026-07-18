# Environment variables

The app needs exactly one environment variable to run. Everything else has been removed.

## The one var

| Var            | Where used               | Build or runtime      |
| -------------- | ------------------------ | --------------------- |
| `WP_API_TOKEN` | `src/utils/wpgraphql.ts` | Runtime (server only) |

`WP_API_TOKEN` is the base64 of `username:application password` for wp.atenews.ph GraphQL Basic auth. Generate it:

```bash
echo -n "username:xxxx xxxx xxxx xxxx xxxx xxxx" | base64
```

Get the application password from WordPress admin at Users > (user) > Application Passwords.

## Why no NEXT*PUBLIC* prefix

`NEXT_PUBLIC_` vars get inlined into the client JavaScript bundle at build time. Anyone who opens the site can read them from the browser devtools. The WordPress token is a secret, so it must NOT be `NEXT_PUBLIC_`.

Without the prefix, Next.js keeps the var server-side. It is read from `process.env` at runtime on the server and never reaches the browser.

## Build-time vs runtime

- **Build-time vars**: `NEXT_PUBLIC_*` only. Inlined into the client bundle during `bun run build`. Changing them needs a rebuild. None exist in this project.
- **Runtime vars**: everything else. Read from `process.env` when the server handles a request. Can change without a rebuild by restarting the process with a new environment. `WP_API_TOKEN` is here.

## Where the var lives

| Environment             | How it is set                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Local dev               | `.env` file at the project root (gitignored)                                                           |
| Docker build            | Not needed. The build does not read the token                                                          |
| Docker runtime (server) | The `docker-compose.yml` on the server sets `WP_API_TOKEN` as an environment variable on the container |

## .env file

`.env` is gitignored. The committed template is `.env.example`. To set up locally:

```bash
cp .env.example .env
# edit .env and fill in WP_API_TOKEN
```

The current `.env` should contain only:

```
WP_API_TOKEN=<base64 of user:app password>
```

## .env and Docker

Because `WP_API_TOKEN` is runtime-only, `.env` is NOT needed during the Docker build. The Dockerfile does not copy or read it. The token is injected at runtime by the server's `docker-compose.yml`:

```yaml
services:
  frontend:
    image: ghcr.io/atenews/atenews-frontend:latest
    environment:
      - WP_API_TOKEN=${WP_API_TOKEN}
```

The compose file reads `WP_API_TOKEN` from a `.env` next to it on the server (or from the server's secret store). Ask the server admin to set it.

If the deployed site returns tRPC auth errors, the container is missing `WP_API_TOKEN`. Check the compose environment block.

## Removed vars (for migration reference)

The following were in older versions of this app and have been removed. If your `.env` or server compose still has them, delete them:

- `NEXT_PUBLIC_WEB_WP_API` renamed to `WP_API_TOKEN` (server-only now)
- `NEXT_PUBLIC_WP_ARTICLE_KEY` unused, removed
- `NEXT_PUBLIC_BACKEND_URL` unused, removed
- `NEXT_PUBLIC_URL` unused, removed (its only consumer, `src/utils/mailTemplates/`, was dead code and got deleted)
- All `NEXT_PUBLIC_FIREBASE_*` (10 vars) unused, removed. No Firebase code exists in `src/`
- `SUPABASE_KEY`, `SUPABASE_ADMIN` unused, removed. No Supabase code exists in `src/`

## Migration steps for the server

When deploying this change, the server's `docker-compose.yml` must set `WP_API_TOKEN`. The old `NEXT_PUBLIC_WEB_WP_API` value (the same base64 string) moves to `WP_API_TOKEN`. Then recreate the container:

```bash
cd /srv/atenews.ph   # or /srv/dev.atenews.ph
# edit docker-compose.yml: replace NEXT_PUBLIC_WEB_WP_API with WP_API_TOKEN
docker compose up -d --force-recreate frontend
```
