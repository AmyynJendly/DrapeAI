# Stage 1: Build React static bundle using Node 20
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm config set strict-ssl false && \
    npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retries 10 && \
    npm install --no-audit
COPY . .
RUN npm run build

# Stage 2: Serve static files using Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
