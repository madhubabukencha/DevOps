# Multistage Dockerfiles
In this section, we will learn about multistage dockerfiles. The `Dockerfile` in this
directory shows how to use multistage dockerfiles. We will build simple express application
using distroless image.

## Converting JS to TypeScript
### About TypeScript
TypeScript is a powerful, open-source superset of JavaScript developed by Microsoft.
It adds static typing to the language, which helps developers catch errors early and
write more maintainable code.

### Steps to convert JS to TS
1. Install TypeScript, TypeScript is runtime dependency so we have used --save-dev flag
   ```bash
   $ npm install --save-dev --save-exact typescript@5.5.3 @types/express@4.17.21
   ```

2. Initialize the TypeScript project, it will create tsconfig.json file
   ```bash
   $ npm tsc --init
   ```

3. Rename your `index.js` to `index.ts` and update the code to
   ```javascript
   const express = require('express');
   ```
   to
   ```typescript
   import express from 'express';
   ```

4. When run `npm run build`, it will produce `index.js` file, we need to specify output directory in `tsconfig.json` file
    ```json
    {
        "outDir": "dist"
    }
    ```

5. In `package.json`, update the `build` script to
    ```json
    "scripts": {
        "build": "tsc"
    }
    ```

6. Run `npm run build` to build the application

7. To see the output, run `node dist/index.js`
