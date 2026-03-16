# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Declare build args (these come from Coolify "Build Arguments")
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Pass them as environment variables so Vite can embed them at build time
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config to handle SPA routing (React Router)
RUN echo 'server { \
    listen 3000; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
