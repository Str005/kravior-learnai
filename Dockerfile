# Multi-stage production Dockerfile for SynapseAI Study Companion
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime Stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src ./src

# Install tsx globally or run via npx for server.ts execution
RUN npm install -g tsx

EXPOSE 3000
CMD ["tsx", "server.ts"]
