# Dockerizing React Application
This document will cover how to create a simple react app on local machine. For containerization,
you can simply refer Dockerfile. It is self explanatory.

- [How to create react application](#how-to-create-react-application)
- [Serving application without WebpackDevServer](#serving-application-without-webpackdevserver)

## How to create react application
- Creating react application using create-react-app
  ```bash
  npx create-react-app --template typescript containerize-react-app
  ```
  - `typescript` is the template for the react application which checks types at compile time
  - `containerize-react-app` is the name of the react application
  
  It stage will take quite good amount of time to complete.

- Once you done creating the react application, you can run it using the following command
  ```bash
  $ cd containerize-react-app
  $ npm start
  ```
  If it runs successfully, you can open your browser and navigate to `http://localhost:3000` to see your react application. This will start the WebpackDevServer. which performs the hot reloading. To get stable build, you can use `npm run build` command.

- If you to make small change to default landing page then,
  go to `containerize-react-app/src/App.tsx` and make the changes.
  ```tsx
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <p>
        Hey Madhu Welcome to React JS!!!
    </p>
    ...
  </header>
  ```
- React use Hot Reloading feature to reload the application when you make changes
  to the source code automatically.

- `WebpackDevServer`: You change code -> Save -> The server notices immediately
  -> It automatically refreshes your browser (or swaps just the changed part via 
   "Hot Module Replacement").
   
   you can find in the: `containerize-react-app\node_modules\react-scripts\scripts\start.js`

  ```js
  const devServer = new WebpackDevServer(serverConfig, compiler);
  ```

## Serving application without WebpackDevServer
To create a production build, use npm run build.
- Run below command to create production build
  ```bash
  $ npm run build
  ```
- It will create a new folder `build` in the root directory of the react application
- This folder contains all the `static` files which are required to serve the application
- I am using `http-server` to serve the application
  ```bash
  $ npx http-server@14.1.1 build
  ```
  - `http-server` is a simple static file server
  - `build` is the directory containing the static files
- The output:
  ```bash
  Starting up http-server, serving build

  http-server version: 14.1.1

  http-server settings: 
  CORS: disabled
  Cache: 3600 seconds
  Connection Timeout: 120 seconds
  Directory Listings: visible
  AutoIndex: visible
  Serve GZIP Files: false
  Serve Brotli Files: false
  Default File Extension: none

  Available on:
    http://192.168.56.1:8080
    http://192.168.0.184:8080
    http://127.0.0.1:8080
    http://172.18.160.1:8080
  Hit CTRL-C to stop the server
  ```
- These does not have Hot Reloading feature. To see your new changes you have to restart the server
- To see new changes again
  ```bash
  $ npm run build
  $ npx http-server@14.1.1 build
  ```

## Containerizing React Application
- For production dockerfile details go through the `Dockerfile`
- For development dockerfile details go through the `Dockerfile.dev`