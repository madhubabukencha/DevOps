# Dockerfile Optimization
- Always keep more table stable commands at the top of the Dockerfile. For example,
  - FROM <image_name>
  - WORKDIR <path>
  - COPY <source> <destination>
  - RUN <command>
  - EXPOSE <port>
  - CMD <command>
  etc.., So that I while building an image from the second time it will use the cache 
  data and I wouldn't build them scratch.

- If you change order of the commands then it might not use the cache data and it will 
  build the image from scratch.

- If you are installing dependencies for your application then separate run and developement
  dependencies. For example, if you are using Node.js then separate run and development dependencies.
  ```
  # Development dependencies
  RUN npm install --only=development
  ```
  It will reduces the image size.

  
