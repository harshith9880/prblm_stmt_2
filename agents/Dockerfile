# -----------------------------
# Base image
# -----------------------------
FROM node:18

# -----------------------------
# Set working directory
# -----------------------------
WORKDIR /app

# -----------------------------
# Copy package.json and install deps
# -----------------------------
COPY package*.json ./
RUN npm install

# -----------------------------
# Copy agent source code
# -----------------------------
COPY . .

# -----------------------------
# Ensure node_modules stays inside the container
# -----------------------------
ENV NODE_PATH=/app/node_modules

# -----------------------------
# Default command (will be overridden per agent)
# -----------------------------
CMD ["node", "intake-agent/index.js"]
