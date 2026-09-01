# syntax=docker/dockerfile:1

# Build multi-stage do Next.js 16 (output: 'standalone').
#
# Gerenciador: PNPM (o lockfile do repo é pnpm-lock.yaml), via corepack — a
# versão sai do campo `packageManager` do package.json, então build local e CI
# usam exatamente a mesma. O runtime é Node: o `server.js` do standalone é o
# alvo suportado do Next.
#
# A imagem é buildada com basePath=/docs (next.config.ts): a doc mora sob /docs
# no mesmo domínio da SPA e a Traefik NÃO faz StripPrefix.

# --- Dependências ---------------------------------------------------------
# Camada isolada: só invalida quando os manifestos mudam. O cache mount guarda
# o store do pnpm entre builds (no CI vem do --cache-from).
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

# --- Build ----------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# `pnpm build` roda o prebuild (content:validate) e o postbuild
# (scripts/prepare-standalone.mjs, que copia .next/static e /public para dentro
# do standalone).
RUN --mount=type=cache,id=next,target=/app/.next/cache \
  pnpm build

# --- Runner ---------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

USER nextjs
EXPOSE 3000

# Com basePath=/docs a raiz `/` responde 404 — o sinal de vida é /docs.
#
# `redirect: manual` + status < 500: com o gate de sessão ligado (DOCS_AUTH_ENABLED)
# o /docs responde 307 para o /login da SPA, que NÃO existe dentro deste container.
# Seguir o redirect daria 404 e marcaria como unhealthy um serviço que está de pé —
# um 307 vindo do proxy.ts já prova que o server está servindo.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/docs',{redirect:'manual'}).then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
