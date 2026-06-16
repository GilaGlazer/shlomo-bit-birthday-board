FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache ca-certificates openssl

# --- NETFREE CERT INSTALL ---
ADD https://netfree.link/cacert/united/x2/unix.sh /home/netfree-unix-ca.sh
RUN cat /home/netfree-unix-ca.sh | sh
ENV NODE_EXTRA_CA_CERTS=/etc/ca-bundle.crt
ENV REQUESTS_CA_BUNDLE=/etc/ca-bundle.crt
ENV SSL_CERT_FILE=/etc/ca-bundle.crt
RUN npm config set cafile /etc/ca-bundle.crt
# --- END NETFREE CERT INSTALL ---

# Install dependencies first (Docker cache layer)
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate

# Copy entrypoint and fix line endings
COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy the rest of the app
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
