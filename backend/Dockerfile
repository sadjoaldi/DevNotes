FROM node:22-alpine AS base
WORKDIR /app

# install pnpm 
RUN npm install -g pnpm 

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Builder
FROM base as builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="file:./dev.db"
RUN pnpm dlx prisma generate
RUN pnpm build

# Runner
FROM base AS runner
ENV NODE_ENV=production
ENV DATABASE_URL="file:./data/prod.db"

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "node -e \"require('child_process').execSync('npx prisma migrate deploy', {stdio: 'inherit'})\" && node dist/server.js"]