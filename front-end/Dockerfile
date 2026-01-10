# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install instead of npm ci to handle lock file sync issues)
RUN npm install

# Copy the rest of the application
COPY . .

# Set NODE_ENV to production for build
ENV NODE_ENV=production

# Build the Next.js application with increased memory and disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Production stage
FROM node:20-alpine AS runtime
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy the standalone build output
# Next.js standalone output includes server.js and all dependencies in .next/standalone
COPY --from=build /app/.next/standalone ./

# Copy static files to the correct location (standalone build expects them in .next/static)
COPY --from=build /app/.next/static ./.next/static

# Copy public folder (standalone build expects it in public/)
COPY --from=build /app/public ./public

# Expose port 3000
EXPOSE 3000

# Start the application using the standalone server
CMD ["node", "server.js"]

