# Dockerfile

# Stage 1: Build local @sihsalus/* modules — deterministic, no network required
FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.13.0 --activate

# Copy root manifests first
COPY package.json yarn.lock .yarnrc.yml turbo.json tsconfig.base.json ./
COPY .yarn/ ./.yarn/

# Copy workspaces (required so Yarn can resolve workspace:* deps)
COPY packages/ ./packages/

ENV CI=true
RUN yarn install --immutable

RUN yarn turbo run build --filter='./packages/apps/*' --filter='!@sihsalus/esm-form-entry-react-app'

# Stage 2: Init container image
# Runs at deployment time: assembles built modules into SPA_OUTPUT_DIR,
# patches index.html with env vars (SPA_PATH, API_URL, SPA_CONFIG_URLS, SPA_DEFAULT_LOCALE),
# and copies config files. The infra repo mounts a shared volume at SPA_OUTPUT_DIR;
# a stock nginx serves from it — no runtime substitution needed.
FROM node:24-alpine AS init
WORKDIR /app

ENV NODE_ENV=production
ENV SPA_OUTPUT_DIR=/spa

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/apps ./packages/apps
COPY --from=builder /app/packages/tooling/scripts/assemble-importmap.js ./packages/tooling/scripts/assemble-importmap.js
COPY config/ ./config/
COPY assets/ ./assets/

CMD ["node", "packages/tooling/scripts/assemble-importmap.js"]
