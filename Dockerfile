# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# کپی package.json و package-lock.json
COPY package*.json ./

# نصب dependencies
RUN npm ci

# کپی بقیه فایل‌ها
COPY . .

# Build پروژه
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# کپی فایل‌های build شده از stage اول
COPY --from=builder /app/dist /usr/share/nginx/html

# کپی configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# پورت اکسپوز
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]