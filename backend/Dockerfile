# ─── Bin Aouf API ─────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm install --omit=dev

# App source
COPY . .

# Persisted uploads live in a volume (see docker-compose)
RUN mkdir -p uploads && chown -R node:node /app
USER node

EXPOSE 4000
CMD ["node", "src/server.js"]
