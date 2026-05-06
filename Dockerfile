# ---------- Builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Install deps (including drizzle-kit)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build SvelteKit
RUN npm run build

# ---------- Runtime ----------
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/build ./build
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "build/index.js"]
