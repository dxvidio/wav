# Stage 1: Build the frontend
FROM node:20 AS builder

WORKDIR /app

# Copy everything and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build frontend
RUN npm run build

# Stage 2: Prepare production server
FROM node:20 AS production

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy server files
COPY server ./server

# Copy built frontend into server/public
COPY --from=builder /app/dist ./server/public

# Copy Prisma files if needed
COPY prisma ./prisma
RUN npx prisma generate

# Set environment variables if needed
ENV NODE_ENV=production

# Expose the port your server listens on
EXPOSE 8080

# Start the server
CMD ["node", "server/index.js"]
