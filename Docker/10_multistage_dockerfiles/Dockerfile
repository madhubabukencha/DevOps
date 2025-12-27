# Stage-1
FROM node:22 AS build
WORKDIR /app
COPY package*.json .
RUN npm ci

# To automaticall build and copy dist files
COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build


# Stage-2
FROM gcr.io/distroless/nodejs22
WORKDIR /app
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/dist dist
ENV PORT=3000

# NODE entrypoint by default set in distroless image 
CMD ["dist/index.js"]
