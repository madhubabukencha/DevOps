# Build Context
In Docker, the **build context** is the set of files and directories that are accessible to the Docker engine during the image creation process.

When you run a command like `docker build .`, the `"."` isn't just telling Docker where the Dockerfile is; it’s defining the context.

---
## How it Works

It is a common misconception that the Docker daemon (the engine that builds the image) directly pulls files from your hard drive. In reality, a transfer happens:

- **Packaging**: When you trigger a build, the Docker CLI gathers all files and folders in the specified path.

- **Transfer**: These files are archived (tarball) and sent to the Docker daemon.

- **Execution**: The daemon receives this "context," unpacks it, and uses it to satisfy COPY or ADD instructions in your Dockerfile.

---
## Managing Build Context with .dockerignore
To keep your builds fast and your images lean, you should use a .dockerignore file. This works
exactly like a .gitignore file; it tells Docker which files to skip when packaging the build context.

**Common items to ignore:**
- .git
- node_modules or vendor
- dist or build folders
- Temp files and logs
- Local secrets/environment variables

---
![build-context](images/build-context.png)