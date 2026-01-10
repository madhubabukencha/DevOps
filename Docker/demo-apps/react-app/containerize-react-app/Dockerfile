# Stage-1
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .

RUN npm install

COPY src src
COPY public public

RUN npm run build

# Stage-2: Serve the application with an HTTP server
FROM nginx:1.27.0

COPY --from=build /app/build /usr/share/nginx/html


