# Dockerfile for testing CI build environment
FROM node:18-alpine

WORKDIR /app

# Install basic tools
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm cache clean --force && \
    rm -f package-lock.json && \
    npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Verify build output
RUN ls -la dist/

# Serve the built files (optional)
EXPOSE 4173
CMD ["npm", "run", "preview"]