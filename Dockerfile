# ---------- build ----------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Prisma generate needs DATABASE_URL in your setup (prisma.config.ts requires it)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate

# Build (tsc -> dist)
RUN npm run build

# Remove dev deps
RUN npm prune --omit=dev


# ---------- runtime ----------
FROM node:20

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# prisma schema + generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# compiled app
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# IMPORTANT: DATABASE_URL must be provided at runtime (docker-compose / server env)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
