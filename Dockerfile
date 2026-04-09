# Dockerfile

# Stage 1: Build local @sihsalus/* modules — deterministic, no network required
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.13.0 --activate

# Copy root manifests first
COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY .yarn/ ./.yarn/

# Copy workspaces (required so Yarn can resolve workspace:* deps)
COPY packages/ ./packages/

ENV CI=true
ENV YARN_ENABLE_NETWORK=0
RUN yarn install --immutable --immutable-cache --check-cache

RUN yarn turbo run build --filter='./packages/apps/*' --filter='!@sihsalus/esm-form-entry-react-app'

# Stage 2: Init container image
# Runs at deployment time: assembles built modules into SPA_OUTPUT_DIR.
# The infra repo mounts a shared volume at SPA_OUTPUT_DIR; nginx serves from it.
FROM node:22-alpine AS init
WORKDIR /app

ENV NODE_ENV=production
ENV SPA_OUTPUT_DIR=/spa

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/apps ./packages/apps
COPY --from=builder /app/packages/tooling/assemble-importmap.js ./packages/tooling/assemble-importmap.js
COPY config/spa-assemble-config.json ./config/spa-assemble-config.json
COPY config/frontend.json ./config/frontend.json

CMD ["node", "packages/tooling/assemble-importmap.js"]
