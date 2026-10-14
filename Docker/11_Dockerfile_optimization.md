# Dockerfile Optimization

Optimizing Dockerfiles improves build speeds, maximizes layer caching, reduces final image sizes, and enhances container security. Below is a comprehensive guide covering essential optimization techniques and modern best practices.

---

## 1. Optimize Instruction Order for Layer Caching

Docker caches the result of each instruction (`RUN`, `COPY`, `ADD`) as an image layer. When rebuilding:
- If a layer hasn't changed, Docker reuses the cached layer.
- **As soon as a layer changes, all subsequent layers are invalidated and must be rebuilt from scratch.**

### Rule: Order from least frequently changing to most frequently changing

1. **Base image & system settings**: `FROM`, `WORKDIR`, `ENV`
2. **System packages & dependencies**: `RUN apt-get ...`
3. **Application dependency files**: `COPY package*.json ./` or `COPY requirements.txt ./`
4. **Dependency installation**: `RUN npm ci` or `RUN pip install ...`
5. **Source code**: `COPY . .`
6. **Build steps / Runtime commands**: `RUN npm run build`, `EXPOSE`, `CMD`

### ❌ Inefficient Example (Re-installs dependencies on every code change):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
```
*Problem:* Any single code or comment edit invalidates the `COPY . .` layer, forcing Docker to re-run `npm install` from scratch.

### ✅ Optimized Example:
```dockerfile
FROM node:20-alpine
WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Install dependencies (cached until package files change)
RUN npm ci --omit=dev

# Copy application source code
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 2. Separate Runtime and Development Dependencies

Do not bundle compilers, test runners, linters, or development tools into your production image.

- **Node.js**:
  Use `npm ci --omit=dev` (or `npm install --only=production`) instead of installing all `devDependencies`.
- **Python**:
  Install only production requirements without saving pip cache:
  ```dockerfile
  RUN pip install --no-cache-dir -r requirements.txt
  ```

---

## 3. Leverage Multi-Stage Builds

Multi-stage builds are the most effective technique to drastically reduce production image sizes. You can use a full SDK/compiler image to build your application, then copy only the compiled artifacts into a lightweight runtime image.

### Example: Multi-Stage Node.js / React Build
```dockerfile
# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal production runtime
FROM nginx:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Example: Multi-Stage Go Build (from hundreds of MBs to ~10MB)
```dockerfile
# Stage 1: Compiler
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server .

# Stage 2: Scratch or Distroless runtime
FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/server /server
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/server"]
```

---

## 4. Choose Small and Appropriate Base Images

Avoid large general-purpose OS images (`ubuntu`, `debian`) unless specifically required.
- Prefer **Alpine** (`node:20-alpine`, `python:3.11-alpine`) or **Debian Slim** (`python:3.11-slim`, `node:20-slim`).
- Use **Distroless** (`gcr.io/distroless/...`) for statically compiled languages (Go, Rust) for maximum security and minimal size.
- **Pin specific image versions** (e.g., `node:20.11-alpine`) instead of using `:latest` to guarantee reproducible builds and predictable cache hits.

---

## 5. Combine and Clean Up in a Single `RUN` Layer

Every `RUN` instruction creates a new immutable layer. If you download packages or temporary archives and delete them in a later `RUN` command, they still take up space in the earlier layer.

### ❌ Inefficient:
```dockerfile
RUN apt-get update
RUN apt-get install -y curl git
RUN rm -rf /var/lib/apt/lists/*
```

### ✅ Optimized (Chained with cleanup):
```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
 && rm -rf /var/lib/apt/lists/*
```
*(Using `--no-install-recommends` prevents installing optional packages you don't need.)*

---

## 6. Always Include a `.dockerignore` File

Without a `.dockerignore` file, the entire working directory (build context) is uploaded to the Docker daemon. This slows down builds and exposes sensitive files.

Create a `.dockerignore` file in the root directory:
```text
.git
.gitignore
node_modules
npm-debug.log
Dockerfile*
.dockerignore
.env*
dist
build
coverage
*.md
.vscode
.idea
```

---

## 7. Use Modern BuildKit Features

BuildKit accelerates builds and offers dedicated caching mechanisms. Enable BuildKit syntax at the top of your Dockerfile:
```dockerfile
# syntax=docker/dockerfile:1
```

### A. Cache Mounts (`--mount=type=cache`)
Persist package manager caches across builds without bloating the image layer:
```dockerfile
# Cache pip downloads
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Cache npm downloads
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
```

### B. Secret Mounts (`--mount=type=secret`)
Avoid baking private keys, tokens, or credentials into image layers via `ENV` or `ARG`:
```dockerfile
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci
```

---

## 8. Prefer `COPY` Over `ADD`

- Use `COPY` for copying local files and directories into the container. It is transparent and predictable.
- Reserve `ADD` only when you specifically need to auto-extract a local `.tar.gz` archive into the image.

---

## 9. Run as a Non-Root User

By default, Docker containers run as `root`. For security hardening, create and switch to a non-privileged user:
```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

---

## Summary Checklist

| Optimization Technique | Benefit |
| :--- | :--- |
| **Order commands by change frequency** | Maximizes build cache hits and speeds up builds |
| **Separate dependency manifest copy from code** | Prevents re-installing libraries on every code change |
| **Multi-stage builds** | Dramatically reduces final image size |
| **Minimal base images (`alpine` / `slim`)** | Reduces attack surface and download size |
| **Combine `RUN` commands & clean caches** | Eliminates orphaned temporary files in layers |
| **Use `.dockerignore`** | Minimizes build context size and protects secrets |
| **BuildKit cache mounts** | Avoids re-downloading packages even after cache invalidation |
| **Non-root user (`USER`)** | Hardens container against privilege escalation |
