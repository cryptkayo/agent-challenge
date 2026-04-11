FROM node:20-slim AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY cryptodesk/ .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN NODE_OPTIONS=--max-old-space-size=4096 pnpm build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 cryptodesk
RUN mkdir -p /data/cryptodesk && chown cryptodesk:nodejs /data/cryptodesk

COPY --from=builder --chown=cryptodesk:nodejs /app/.next/standalone ./
COPY --from=builder --chown=cryptodesk:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER cryptodesk
EXPOSE 3000

CMD ["node", "server.js"]