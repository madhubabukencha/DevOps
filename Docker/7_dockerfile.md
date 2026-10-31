# Dockerfile
This document will cover the details of dockerfile.
- [What is Dockerfile?](#what-is-dockerfile)
- [Steps to build an image from docker file](#steps-to-build-an-image-from-docker-file)
- [Core Dockerfile Instructions](#core-dockerfile-instructions)
- [Difference between CMD and ENTRYPOINT](#difference-between-cmd-and-entrypoint)
- [When to use CMD vs ENTRYPOINT](#when-to-use-cmd-vs-entrypoint)

## What is Dockerfile?
Dockerfile gives you the power to create custom image that perfectly match your requirements.
Below are some advantages from docker file:
- **Reproducibility**: By defining all the steps necessary to build your Docker images, you ensure that the same image can be built consistently across different environments.
- **Automation**: Dockerfiles can be used to automate the build process, making it easier to create and manage images.
- **Transparency and Documentation**: Dockerfiles serve as a clear and concise documentation of the steps required to build your images.

> NOTE:
  Each and every instruction in a Dockerfile is executed in a new layer. This means that if you have multiple instructions in a Dockerfile, each instruction will create a new layer. 

## Steps to build an image from docker file
- Create a Dockerfile in the root directory of your project.
- Write the commands in the Dockerfile.
- Build the image using the following command.
  ```bash
  $ docker build -t <image_name> <path_to_dockerfile or .>
  ```
  - `-t`: flag is used to tag the image.
  - `<image_name>`: is the name of the image.
  - `<path_to_dockerfile or .>`: is the path to the Dockerfile.

- Let's say you have an image with some tag name and Dockerfile configuration. With this Image you have created a container. Now you have madified the Dockerfile but used the same tag name to build the image. In this case, the new image will be created with the same tag name but the container will not be updated. To update the container, you need to remove the container and create a new container with the new image.

## Core Dockerfile Instructions

Here is a consolidated reference for the most commonly used Dockerfile instructions:

### 1. `FROM`
- **Purpose**: Defines the base image to start building from. Every valid Dockerfile must start with a `FROM` instruction (with an optional `ARG` before it for parameterized image names).
- **Syntax**:
  ```dockerfile
  FROM <image>[:<tag>] [AS <stage-name>]
  ```
- **Example**:
  ```dockerfile
  FROM node:20-alpine
  ```

---

### 2. `WORKDIR`
- **Purpose**: Sets the working directory for any subsequent `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, and `ADD` instructions. If the directory does not exist, Docker creates it automatically.
- **Best Practice**: Always use `WORKDIR` instead of chaining `RUN cd /some/path`.
- **Syntax**:
  ```dockerfile
  WORKDIR /path/to/workdir
  ```
- **Example**:
  ```dockerfile
  WORKDIR /app
  ```

---

### 3. `COPY`
- **Purpose**: Copies files or directories from the build context (host machine) into the container's filesystem.
- **Syntax**:
  ```dockerfile
  COPY [--chown=<user>:<group>] <src>... <dest>
  ```
- **Examples**:
  ```dockerfile
  # Copy package.json to the current working directory
  COPY package*.json ./

  # Copy an entire directory
  COPY src/ ./src/

  # Copy with specific file permissions / ownership
  COPY --chown=node:node . .
  ```

---

### 4. `ADD`
- **Purpose**: Similar to `COPY`, but offers additional functionality:
  1. Automatically extracts local compressed archives (`tar`, `tar.gz`, `tgz`, etc.) into the destination.
  2. Can fetch remote URLs and copy them into the container.
- **Best Practice**: Prefer `COPY` over `ADD` unless you explicitly require automatic tar extraction.
- **Syntax**:
  ```dockerfile
  ADD <src>... <dest>
  ```
- **Example**:
  ```dockerfile
  # Automatically unpacks the archive into /opt
  ADD archive.tar.gz /opt/
  ```

---

### 5. `RUN`
- **Purpose**: Executes commands in a new layer during the image build process and commits the results. Commonly used to install packages, build dependencies, or configure system settings.
- **Syntax**:
  - **Shell form**: `RUN <command>` (runs in `/bin/sh -c` on Linux or `cmd /S /C` on Windows)
  - **Exec form**: `RUN ["executable", "param1", "param2"]`
- **Best Practice**: Chain multiple commands with `&& \` and clean package caches in the same `RUN` command to keep image layers small.
- **Example**:
  ```dockerfile
  RUN apt-get update && apt-get install -y --no-install-recommends \
      curl \
      git \
   && rm -rf /var/lib/apt/lists/*
  ```

---

### 6. `ENV`
- **Purpose**: Sets persistent environment variables. They are available **both during image build time and at container runtime**.
- **Syntax**:
  ```dockerfile
  ENV <key>=<value> ...
  ```
- **Example**:
  ```dockerfile
  ENV NODE_ENV=production
  ENV PORT=3000
  ```

---

### 7. `ARG`
- **Purpose**: Defines build-time variables that users can pass via the CLI using `docker build --build-arg <varname>=<value>`.
- **Difference from `ENV`**: `ARG` values are **only available during build time** and do NOT persist in the running container unless explicitly copied into an `ENV`.
- **Syntax**:
  ```dockerfile
  ARG <name>[=<default-value>]
  ```
- **Example**:
  ```dockerfile
  ARG VERSION=1.0.0
  RUN echo "Building version ${VERSION}"
  ```

---

### 8. `EXPOSE`
- **Purpose**: Informs Docker that the container listens on specified network ports at runtime. Acts as documentation between the image author and container runner; it does **not** publish the port to the host machine automatically (use `-p` or `-P` during `docker run`).
- **Syntax**:
  ```dockerfile
  EXPOSE <port>[/<protocol>]
  ```
- **Example**:
  ```dockerfile
  EXPOSE 80/tcp
  EXPOSE 443/tcp
  ```

---

### 9. `USER`
- **Purpose**: Specifies the username (or UID) and optionally the group (or GID) for subsequent instructions and for running the container.
- **Best Practice**: Switch away from `root` to an unprivileged user for improved security.
- **Syntax**:
  ```dockerfile
  USER <user>[:<group>]
  ```
- **Example**:
  ```dockerfile
  USER node
  ```

---

### 10. `VOLUME`
- **Purpose**: Creates a mount point with the specified path and marks it as holding externally mounted volumes from the host or other containers.
- **Syntax**:
  ```dockerfile
  VOLUME ["/path/to/dir"]
  ```
- **Example**:
  ```dockerfile
  VOLUME ["/var/lib/data"]
  ```

---

### 11. `CMD` & `ENTRYPOINT`
- **Purpose**: Specifies what executable or command runs when the container starts.
- *Detailed comparison, runtime overriding, and best practices are explained in the sections below.*

---

### Quick Summary Reference

| Instruction | Scope / Stage | Creates Layer? | Main Purpose |
|---|---|---|---|
| `FROM` | Build | Yes | Sets base image for build stages |
| `WORKDIR` | Build & Runtime | No (Metadata) | Sets working directory |
| `COPY` | Build | Yes | Copies files/directories from host into container |
| `ADD` | Build | Yes | Copies files, extracts archives, or downloads URLs |
| `RUN` | Build | Yes | Executes commands and commits a new layer |
| `ENV` | Build & Runtime | No (Metadata) | Sets persistent environment variables |
| `ARG` | Build only | No (Metadata) | Build-time variables passed via `--build-arg` |
| `EXPOSE` | Runtime (Doc) | No (Metadata) | Documents ports the container listens on |
| `USER` | Build & Runtime | No (Metadata) | Drops root privileges to run as specific user |
| `VOLUME` | Runtime | No (Metadata) | Declares mount points for external storage |
| `ENTRYPOINT` | Runtime | No (Metadata) | Defines fixed default executable |
| `CMD` | Runtime | No (Metadata) | Defines default command or arguments (overridable) |




## Difference between CMD and ENTRYPOINT
- CMD is used to provide default command to run when container starts. But,
  - CMD can be overriden at runtime.
    - Create a Dockerfile, let's name it `Dockerfile.cmd`
      ```dockerfile
      FROM alpine
      CMD ["echo", "Hello World"]
      ```
    - Building an image. In the below command "." is required to tell build command about context:
      ```bash
      $  docker build -t with_cmd:v0.0.1 -f "Dockerfile.cmd" .
      ```
    - Run the image:
      ```bash
      $ docker run with_cmd:v0.0.1
      ```
    - Overriding CMD message at runtime, it will print "Happy New year Madhu" instead of "Hello World":
      ```bash
      $ docker run with_cmd:v0.0.1 echo "Happy New year Madhu"
      ```
  
- ENTRYPOINT is used to provide default command to run when container starts. But,
  - With ENTRYPOINT, you can't override the command at runtime but it will append the data.
    - Creating a `Dockerfile` and name it `Dockerfile.entrypoint`
      ```dockerfile
      FROM alpine
      ENTRYPOINT ["echo", "Hello World"]
      ```
    - Building docker image:
      ```bash
      $ docker build -t with_entrypoint:v0.0.1 -f Dockerfile.entrypoint .
      ```
    - Run the image:
      ```bash
      $ docker run with_entrypoint:v0.0.1
      ```
    - Instead of overriding it will append the data, you will get output as "Hello World echo Hello Docker":
      ```bash
      $ docker run with_entrypoint:v0.0.1 echo "Hello Docker"
      ```

    - To override the entrypoint, you can use --entrypoint flag:
      ```bash
      $ docker run --entrypoint "echo" with_entrypoint:v0.0.1 "Hello Madhu"
      ```

## When to use CMD vs ENTRYPOINT?

1. **Use `CMD` when:**
   - You want to provide **default arguments** that the user can easy override.
   - The container is intended to be used flexibly (e.g., a base OS image where the user might want to run `bash`, `python`, etc.).

2. **Use `ENTRYPOINT` when:**
   - You want your container to behave like a **single executable** or a CLI tool.
   - You want to enforce a specific command to execute, allowing users to only append arguments to it.

3. **Use BOTH (`ENTRYPOINT` + `CMD`) when:**
   - You want to define a fixed command (executable) but provide default arguments for it.
   - `ENTRYPOINT` specifies the executable, and `CMD` specifies the default parameters.
   ```dockerfile
   FROM alpine
   ENTRYPOINT ["ping"]
   CMD ["google.com"]
   ```
   *Running `docker run <image>` will ping google.com.*  
   *Running `docker run <image> localhost` will ping localhost (overriding CMD).*

