# Express App
This document will cover how to create a simple express app and dockerize it. To run this app, you need to have Node.js installed. We are going to use Node Package Manager (npm) to install the required packages.

- Initialize a Node.js project, it will create a package.json file
  ```bash
  $ npm init -y
  ```
- Install express and body-parser packages and to lock the version, use --save-exact flag
  ```bash
  $ npm install express@4.19.2 body-parser@1.20.3 --save-exact
  ```

- In package.json file, add a start script
  ```json
  "scripts": {
    "start": "node src/index.js"
  }
  ```

## Testing the app
- To start the app, open terminal and run the following command
  ```bash
  $ npm start
  ```
- To test the app, open another terminal and run the following command
  ```bash
  $ curl http://localhost:3000
  ```
  It will return "Hello World!"

- To get already registered users, open another terminal and run the following command
  ```bash
  $ curl http://localhost:3000/users
  ```

- To register a new user, open another terminal and run the following command
  ```bash
  $ curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"userId": "test"}'
  ```

- Leaving an empty userId will return "User ID is required"
  ```bash
  $ curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{}'
  ```

- Registering a duplicate user will return "User already exists"
  ```bash
  $ curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"userId": "test"}'
  ```

## Dockerizing the app
- You can find the Dockerfile in the root directory
- Build the docker image
  ```bash
  $ docker build -t express_app:v0.0.1 .
  ```
- Run the docker container
  ```bash
  $ docker run -d -p 3000:3000 --name express_app express_app:v0.0.1
  ```
- Test the app
  ```bash
  $ curl http://localhost:3000
  ```
- To get already registered users, open another terminal and run the following command
  ```bash
  $ curl http://localhost:3000/users
  ```
- To register a new user, open another terminal and run the following command
  ```bash
  $ curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"userId": "test"}'
  ```