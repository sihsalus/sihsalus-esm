# Dockerfile

# Stage 1: Install dependencies and build
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

# Copy workspace files first for better layer caching
COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY packages/ ./packages/
COPY config/ ./config/
COPY scripts/ ./scripts/

RUN yarn install --immutable
RUN yarn turbo run build --filter='./packages/apps/*' --filter='./packages/shell/*'

# Stage 2: Assemble import map and static assets
FROM node:20-alpine AS assembler
WORKDIR /app
COPY --from=builder /app .
RUN node scripts/assemble-importmap.js

# Stage 3: Serve with Nginx
FROM nginx:1.27-alpine AS runtime
RUN rm -rf /usr/share/nginx/html/*
COPY --from=assembler /app/dist/spa /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Security hardening: non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S -D -H -u 1001 -G appuser appuser && \
    chown -R appuser:appuser /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER appuser

ENV SPA_PATH=/openmrs/spa
ENV API_URL=/openmrs
ENV BACKEND_URL=http://backend:8080

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost:8080/openmrs/spa/ || exit 1
