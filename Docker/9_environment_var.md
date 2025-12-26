# Environment Variables
In this section, we create a Dockerfile that uses environment variables and we will show you how to access them
in simple express app.

- Create Dockerfile
  ```dockerfile
  FROM node:22
  WORKDIR /app
  COPY package*.json .
  RUN npm install ci
  COPY src/index.js .
  # Create environment variable
  ENV PORT=3000
  CMD ["node", "index.js"]
  ```
- Create index.js
  ```javascript
  const express = require("express");
  const app = express();
  // Access environment variable
  const port = process.env.PORT;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  ```

- Build and run the container
  ```bash
  docker build -t my-node-app .
  docker run -p 3000:3000 my-node-app
  ```

- To overwrite environment variable at time of running container use -e flag:
 Eg: 
  ```bash
  docker run -e PORT=4000 -e ... -p 4000:4000 my-node-app
  ```

-  If environment variables keep growing then your CLI command look long. So, we can create a .env file
   and pass it in terminal
   eg: `.env` file content
   ```
   PORT=3000
   ```
   and run the container
   ```bash
   docker run --env-file ".env" -p 3000:3000 my-node-app
   ```
