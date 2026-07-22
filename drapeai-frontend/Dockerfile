# Stage 1: Build React static bundle using Node 20
# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app

# Copy manifests first — only re-runs npm ci when package-lock.json changes
COPY package.json package-lock.json ./

# Use BuildKit inline cache mount so npm packages survive across builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund

COPY . .
RUN npm run build

# Stage 2: Serve static files using Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
