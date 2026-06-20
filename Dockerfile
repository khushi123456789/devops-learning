# Use a small, current LTS Node image
FROM node:20-alpine

# App lives here
WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .
# Create the data directory and give the node user ownership
RUN mkdir -p /app/data && chown -R node:node /app/data

# Now switch to the non-root user
USER node

# The app listens on 3000 (override with the PORT env var)
ENV PORT=3000
EXPOSE 3000

# Lightweight container healthcheck hitting the /health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "index.js"]
