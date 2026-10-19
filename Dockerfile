# Dockerfile for testing CI build environment
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install deterministic dependencies from lockfile
RUN npm ci

# Copy source code
COPY . .

# Run unit tests and build the project
RUN npm run test:unit && npm run build

# Serve the built files
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]