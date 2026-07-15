# Stage 1: build the Vite app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first to leverage Docker cache
COPY package*.json ./
RUN npm ci

# Copy source files and build
COPY . .
# ARG BUILD_MODE=uat
RUN npm run build

# Stage 2: run with nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]