# Deployment

How code gets from a branch to a live site. Fully automated through GitHub Actions and a self-hosted runner.

## Branches

| Branch | Deploys to             | Image tag                                 | Compose dir on server |
| ------ | ---------------------- | ----------------------------------------- | --------------------- |
| `dev`  | https://dev.atenews.ph | `ghcr.io/atenews/atenews-frontend:dev`    | `/srv/dev.atenews.ph` |
| `prod` | https://atenews.ph     | `ghcr.io/atenews/atenews-frontend:latest` | `/srv/atenews.ph`     |

`prod` is the default branch. Work on `dev`, merge to `prod` when ready to release.

## The pipeline

Both branches have a GitHub Actions workflow in `.github/workflows/` (`dev.yml`, `production.yml`). They are identical except for the branch, image tag, and server path.

### Step 1: build and push image (runs on GitHub-hosted Ubuntu)

1. Checkout the branch
2. Log into GHCR with `GITHUB_TOKEN`
3. `docker buildx build` the Dockerfile
4. Push the image to `ghcr.io/atenews/atenews-frontend:<tag>`
5. Cache layers in GitHub Actions cache (`type=gha`)

### Step 2: deploy (runs on the self-hosted runner)

1. SSH-equivalent into the server
2. `cd` to the compose directory (`/srv/dev.atenews.ph` or `/srv/atenews.ph`)
3. `docker compose up -d --force-recreate --pull=always frontend-dev` (or `frontend`)
4. Compose pulls the new image and restarts the container

The compose files and `.env` for the server live on the server, not in this repo. Only the image is built here.

## The Dockerfile

Three stages:

```
oven/bun:alpine   (base)
   |
   +-- deps     bun install --frozen-lockfile
   +-- builder  copy source, bun run build (standalone output)
   |
node:lts-alpine   (runner)
   copy .next/standalone, .next/static, public
   run as non-root user `atenews`
   CMD ["node", "server.js"]
```

Why Bun for build and Node for runtime: Bun installs deps and runs `next build` fast. The standalone output is a Node.js server, so the runner uses `node:lts-alpine`. Bun is not in the final image.

Standalone output means the runner image contains only what Next.js traced as needed. No `node_modules` install at runtime, no `bun install` in the runner. Smaller image, faster cold start.

The `.env` file is copied into the builder stage (not in `.dockerignore`) so `NEXT_PUBLIC_*` vars are inlined into the client bundle at build time. See [environment.md](./environment.md).

## Health check

The Dockerfile has a healthcheck that hits `http://localhost:3000/staff`:

```
HEALTHCHECK CMD ["wget", "-qO-", "http://localhost:3000/staff"]
```

If `/staff` returns non-200, the container is marked unhealthy.

## Port

The container listens on `3000` (`PORT=3000`, `HOSTNAME=0.0.0.0`). The reverse proxy on the server (Caddy or Nginx) terminates TLS and forwards to the container.

## Pull requests

`.github/workflows/pull-requests.yml` runs on PRs. It builds the image but does not push or deploy. Use it to verify a branch builds before merging.

## Release checklist

To ship a change to production:

1. Open a PR from `dev` to `prod` (or from a feature branch to `dev` first)
2. Confirm the PR build passes
3. Merge to `prod`
4. Watch the Production workflow run in GitHub Actions
5. Once `deploy-image` finishes, verify https://atenews.ph

To ship a change to dev only:

1. Push or merge to `dev`
2. Watch the Dev workflow
3. Verify https://dev.atenews.ph

## Rolling back

Each deploy overwrites the image tag (`dev` or `latest`). To roll back, re-run a previous successful workflow run from the GitHub Actions UI, or push a revert commit and let CI rebuild.

There is no blue-green deploy or multi-version image tagging. The previous image layer cache may still exist on the runner, but the compose always pulls `:dev` or `:latest`.

## Secrets

| Secret                         | Used by                                                 |
| ------------------------------ | ------------------------------------------------------- |
| `GITHUB_TOKEN` (auto)          | GHCR login                                              |
| Self-hosted runner credentials | The deploy step runs on a runner registered to the repo |

No additional secrets are needed in GitHub. The WordPress token and Firebase keys are in `.env` on the build context, not in GitHub secrets.
