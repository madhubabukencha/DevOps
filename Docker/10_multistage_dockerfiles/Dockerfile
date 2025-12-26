# Stage-1
FROM node:22 AS build
WORKDIR /app
COPY package*.json .
RUN npm ci

# Stage-2
FROM gcr.io/distroless/nodejs22
WORKDIR /app
COPY --from=build /app/node_modules node_modules
COPY src src
ENV PORT=3000

# NODE entrypoint by default set in distroless image 
CMD ["src/index.js"]
