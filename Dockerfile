# Dockerfile

# Stage 1: Install dependencies and build
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.13.0 --activate

# Copy workspace files first for better layer caching
COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY packages/ ./packages/
COPY config/ ./config/
COPY scripts/ ./scripts/

ENV CI=true
RUN yarn install --immutable
RUN yarn turbo run build --filter='./packages/apps/*' --filter='./packages/shell/*'

# Stage 2: Assemble import map and static assets
FROM node:20-alpine AS assembler
WORKDIR /app
COPY --from=builder /app .
RUN node scripts/assemble-importmap.js

# Stage 3: Output — just the SPA static files
# Nginx/reverse proxy configuration is managed in the infra repo
FROM scratch AS output
COPY --from=assembler /app/dist/spa /spa
