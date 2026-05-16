FROM node:22-alpine AS base
WORKDIR /app

# install pnpm 
RUN npm install -g pnpm

# Dependencies
FROM base AS deps 
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts 

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runner - nginx pour servir les fichiers statiques
FROM nginx:alpine AS runner 
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]