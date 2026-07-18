FROM oven/bun:alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun --bun next build

FROM oven/bun:alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup nodejs
RUN adduser -SDH atenews
RUN mkdir .next
RUN chown atenews:nodejs .next

COPY --from=builder --chown=atenews:nodejs /app/.next/standalone ./
COPY --from=builder --chown=atenews:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=atenews:nodejs /app/public ./public

USER atenews

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD ["wget", "-qO-", "http://localhost:3000/staff"]

CMD ["bun", "server.js"]