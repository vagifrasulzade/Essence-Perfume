# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install instead of npm ci to handle lock file sync issues)
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS runtime
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy the standalone build output
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Expose port 3000
EXPOSE 3000

# Start the application using the standalone server
CMD ["node", "server.js"]

