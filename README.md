# Atenews Frontend

Next.js frontend for [atenews.ph](https://atenews.ph), the official student publication of Ateneo de Davao University. Reads all content from a WordPress backend at wp.atenews.ph.

## Stack

- Next.js 16 (Pages Router) + React 19 + TypeScript
- tRPC 11 for the API layer (server procedures under `src/server/routers`)
- WordPress backend: WPGraphQL + WP REST API
- MUI 9 for components, `@mui/styles` for JSS styling
- Bun for install and build, Node standalone for runtime
- Docker images on GHCR, deployed via GitHub Actions

## Quick start

```bash
bun install
cp .env.example .env   # then fill in values (see docs/environment.md)
bun run dev            # http://localhost:3000
```

You need a working `.env` file before the site can fetch from WordPress. See `docs/environment.md`.

## Documentation

Full docs live in [`docs/`](./docs). Start with [architecture](./docs/architecture.md).

| Doc                                                      | What it covers                                                  |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| [docs/architecture.md](./docs/architecture.md)           | How the app fits together, request and data flow                |
| [docs/wordpress-backend.md](./docs/wordpress-backend.md) | WordPress as the backend. What maps to what. How to add content |
| [docs/data-fetching.md](./docs/data-fetching.md)         | tRPC procedures, GraphQL via fetch, TanStack Query cache        |
| [docs/pages-and-routes.md](./docs/pages-and-routes.md)   | URL structure and page components                               |
| [docs/styling.md](./docs/styling.md)                     | MUI 9, `@mui/styles`, the MUICompat shims                       |
| [docs/environment.md](./docs/environment.md)             | Every env var and where it comes from                           |
| [docs/deployment.md](./docs/deployment.md)               | CI/CD, Docker, dev and prod branches                            |
| [docs/development.md](./docs/development.md)             | Local setup, commands, project layout, conventions              |
| [docs/troubleshooting.md](./docs/troubleshooting.md)     | Common errors and fixes                                         |

## Scripts

| Command            | Does                                                                        |
| ------------------ | --------------------------------------------------------------------------- |
| `bun run dev`      | Start dev server with hot reload                                            |
| `bun run build`    | Production build (standalone output to `.next/standalone`)                  |
| `bun run start`    | Run the built server (use `node .next/standalone/server.js` for standalone) |
| `bun run lint`     | Run ESLint                                                                  |
| `bun run lint:fix` | Run ESLint and auto fix                                                     |

## Branches

- `prod` ships to [atenews.ph](https://atenews.ph). Stable. Merge here to release.
- `dev` ships to [dev.atenews.ph](https://dev.atenews.ph). Stage and test here first.

See [docs/deployment.md](./docs/deployment.md) for the full pipeline.
