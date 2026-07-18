# Deployment

How code gets from a branch to a live site. Fully automated through GitHub Actions and a self-hosted runner.

## Branches

| Branch | Deploys to             | Image tag                                 | Compose dir on server |
| ------ | ---------------------- | ----------------------------------------- | --------------------- |
| `dev`  | https://dev.atenews.ph | `ghcr.io/atenews/atenews-frontend:dev`    | `/srv/dev.atenews.ph` |
| `prod` | https://atenews.ph     | `ghcr.io/atenews/atenews-frontend:latest` | `/srv/atenews.ph`     |

`prod` is the default branch.

### Branch protection

`prod` is a protected branch. Direct pushes are rejected. The only way to land changes on `prod` is through a pull request that gets merged. `dev` is not protected, so you can push directly to it.

### Workflows

**Multiple developers (recommended):**

1. Create a feature branch off `dev` (for example `feat/article-share` or `fix/footer-center`)
2. Open a PR from the feature branch to `dev`
3. Merge the PR after review
4. Wait for the dev deploy to finish, then check https://dev.atenews.ph
5. Open a PR from `dev` to `prod`
6. Merge to finalize and ship to https://atenews.ph

**Solo developer:**

1. Push commits directly to `dev`
2. Check https://dev.atenews.ph
3. Open a PR from `dev` to `prod` and merge

Either way, `prod` only receives changes through a merged pull request.

### Creating the dev-to-prod PR

```bash
git checkout prod
git pull
git checkout -b release/dev-to-prod
git merge dev
git push -u origin release/dev-to-prod
gh pr create --base prod --head release/dev-to-prod --title "Merge dev into prod"
gh pr merge --merge   # run after the PR opens
```

Or use the GitHub web UI. The merge triggers the Production workflow automatically.

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
oven/bun:alpine   (base, also the runner)
   |
   +-- deps     bun install --frozen-lockfile
   +-- builder  copy source, bun --bun next build (standalone output)
   |
oven/bun:alpine   (runner)
   copy .next/standalone, .next/static, public
   run as non-root user `atenews`
   CMD ["bun", "server.js"]
```

Pure Bun end to end. The same `oven/bun:alpine` image is the base for deps, builder, and runner. Bun installs deps, builds the app, and runs the standalone server. No Node.js in the final image.

Bun can run the Next.js standalone `server.js` directly because it is Node-compatible. This keeps the small standalone image size while using Bun as the runtime.

Standalone output means the runner image contains only what Next.js traced as needed. No `node_modules` install at runtime, no `bun install` in the runner. Smaller image, faster cold start.

The build does NOT need `.env`. The WordPress token (`WP_API_TOKEN`) is server-only and runtime, so it is injected by the server's `docker-compose.yml` when the container starts, not baked in at build time. See [environment.md](./environment.md).

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

To ship a change to production (see the workflows section above for the full branch flow):

1. Make sure the change is on `dev` and verified at https://dev.atenews.ph
2. Open a PR from `dev` to `prod` (required, `prod` is protected)
3. Confirm the PR build passes
4. Merge the PR
5. Watch the Production workflow run in GitHub Actions
6. Once `deploy-image` finishes, verify https://atenews.ph

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

No additional secrets are needed in GitHub. The WordPress token is set on the server's `docker-compose.yml`, not in GitHub secrets and not in the image.
