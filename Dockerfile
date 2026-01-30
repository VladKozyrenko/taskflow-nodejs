# -------- build --------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Prisma needs DATABASE_URL at "generate" time (for prisma.config.ts validation),
# but it doesn't need a real database connection.
ARG DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate

RUN npm run build
RUN npm prune --omit=dev

# -------- runtime --------
FROM node:20

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# IMPORTANT: real DATABASE_URL will be provided at runtime by docker-compose
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
