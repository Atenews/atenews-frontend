# Environment variables

All env vars live in `.env` at the project root. The file is gitignored and never committed. Copy the keys into your local `.env` and fill in values.

Next.js reads `.env` automatically for both `bun run dev` and `bun run build`. The Docker build copies `.env` into the builder stage (it is not in `.dockerignore`), so `NEXT_PUBLIC_*` vars are inlined into the client bundle at build time.

## The vars

### WordPress (required, the site breaks without these)

| Var                          | What it is                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_WEB_WP_API`     | Base64 of `username:application password` for wp.atenews.ph GraphQL Basic auth |
| `NEXT_PUBLIC_WP_ARTICLE_KEY` | WordPress article key (referenced in code paths, kept for legacy use)          |

See [wordpress-backend.md](./wordpress-backend.md) for how to generate the application password.

### Firebase (legacy, currently unused in code)

| Var                                        | Notes |
| ------------------------------------------ | ----- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             |       |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         |       |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL`        |       |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          |       |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      |       |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |       |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              |       |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`      |       |
| `NEXT_PUBLIC_FIREBASE_PRIVATE_KEY`         |       |
| `NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL`        |       |

None of these are imported anywhere in `src/` right now. They exist for the profile/auth features that were removed. Safe to leave blank.

### Supabase (legacy, currently unused in code)

| Var              | Notes            |
| ---------------- | ---------------- |
| `SUPABASE_KEY`   | anon key         |
| `SUPABASE_ADMIN` | service role key |

Also not imported in `src/`. Legacy.

### Other

| Var                       | What it is                                        |
| ------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_URL`         | Public site URL (used for SEO and absolute links) |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL (legacy)                          |

## Build-time vs runtime

`NEXT_PUBLIC_*` vars are inlined into the client JS bundle at build time. Changing them requires a rebuild. Non-`NEXT_PUBLIC_` vars are read from `process.env` at runtime on the server, so they can change without a rebuild.

In this project the WordPress token is `NEXT_PUBLIC_WEB_WP_API` because it is also used server-side in `src/utils/wpgraphql.ts`. It gets baked into the bundle during `bun run build`, so the Docker builder stage needs `.env` present.

## Getting a working .env

Ask a team member for the real values, or derive them from a working deployment. The minimum to run the site locally:

```
NEXT_PUBLIC_WEB_WP_API=<base64 of user:app password>
NEXT_PUBLIC_URL=https://atenews.ph
```

The Firebase and Supabase vars can be empty for local dev.

## .env and Docker

`.env` is not in `.dockerignore`. The Dockerfile `COPY . .` step in the builder stage includes it, so `bun run build` sees the vars and inlines `NEXT_PUBLIC_*` into the standalone output.

If you add `.env` to `.dockerignore`, the build will succeed but the deployed site will have empty `NEXT_PUBLIC_*` values and return 500 errors from tRPC. Keep `.env` out of `.dockerignore`.
