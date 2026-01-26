# ---------- build ----------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Prisma client
RUN npx prisma generate

# Build (tsc -> dist)
RUN npm run build

# Remove dev deps to make node_modules production-only
RUN npm prune --omit=dev

# ---------- runtime ----------
FROM node:20

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./

# Copy production node_modules from builder (no second npm ci)
COPY --from=builder /app/node_modules ./node_modules

# Prisma schema + generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# compiled app
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
