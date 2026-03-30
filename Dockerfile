# Dockerfile

# Stage 1: Build local @sihsalus/* modules — deterministic, no network required
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.13.0 --activate

# Copy workspace files first for better layer caching
COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY packages/ ./packages/
COPY scripts/ ./scripts/

ENV CI=true
RUN yarn install --immutable
RUN yarn turbo run build --filter='./packages/apps/*'

# Stage 2: Init container image
# This image runs at deployment time (not build time) to:
#   1. Copy locally-built @sihsalus/* modules
#   2. Fetch @openmrs/* modules from the running backend
#   3. Assemble the final importmap and write everything to SPA_OUTPUT_DIR
# The infra repo mounts a shared volume at SPA_OUTPUT_DIR; nginx serves from it.
FROM node:22-alpine AS init
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/apps ./packages/apps
COPY scripts/assemble-importmap.js ./scripts/

# SPA_OUTPUT_DIR: path to the shared volume nginx will serve
# SIHSALUS_BACKEND_URL: backend to fetch @openmrs/* modules from
ENV SPA_OUTPUT_DIR=/spa

CMD ["node", "scripts/assemble-importmap.js"]
