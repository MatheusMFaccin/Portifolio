# ─── Stage 1: build ───────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --frozen-lockfile

COPY frontend/ .
RUN npm run build

# ─── Stage 2: serve with nginx ────────────────────────
FROM nginx:1.27-alpine

# Remove config padrão
RUN rm -f /etc/nginx/conf.d/default.conf

# Copia build e config customizada
COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
