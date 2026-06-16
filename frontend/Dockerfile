FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Serve with Nginx ---
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
RUN printf '#!/bin/sh\necho ""\necho "  Birthday Board is ready!"\necho "  Open http://localhost:5173"\necho ""\nexec nginx -g "daemon off;"\n' \
    > /start.sh && chmod +x /start.sh
CMD ["/start.sh"]
