# Etapa 1: Compilación
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Compila el proyecto Angular para producción
RUN npm run build -- --configuration production

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine
# IMPORTANTE: Revisa en angular.json que "outputPath" sea exactamente esta ruta
COPY --from=build /app/dist/coretask-frontend/browser /usr/share/nginx/html
EXPOSE 80