FROM node:22

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .

# Do clean install
RUN npm install ci

# Copy index.js to app directory
COPY src/index.js .

# Expose port
EXPOSE 3000

# Run app
CMD ["node", "index.js"]

