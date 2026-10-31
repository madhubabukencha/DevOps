# Dangling Resources in Docker

## What Does "Dangling" Mean in Docker?

In Docker, a **dangling resource** refers to an **orphaned, untagged, or unreferenced object** (such as an image or a volume) that is no longer attached to any active or stopped container, nor identified by any friendly tag or name.

These resources continue to reside on your host filesystem, silently consuming valuable disk space until they are explicitly pruned or deleted.

---

## 1. Dangling Images (`<none>:<none>`)

### What is a Dangling Image?
A dangling image is an image layer that has lost its repository name and tag. When you list your images using `docker images`, dangling images show up with `<none>` for both `REPOSITORY` and `TAG`:

```text
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
<none>       <none>    9e8b7c2a10d4   2 hours ago     184MB
my-react-app latest    4d8f5c123abc   5 minutes ago   186MB
```

### How Do Dangling Images Get Created?
The most frequent cause is **rebuilding an image using an existing tag**:

1. You build an image with a specific tag:
   ```bash
   docker build -t web-app:1.0 .
   ```
2. You modify your application code or `Dockerfile` and rebuild using the **exact same tag**:
   ```bash
   docker build -t web-app:1.0 .
   ```
3. Docker transfers the tag `web-app:1.0` to the **newly built** image.
4. The previous image doesn't get deleted automatically; instead, its tag is stripped away, leaving it as `<none>:<none>`. Because no container or tag points to it, it is now a **dangling image**.

> **Note**: Failed builds or cancelled multi-stage build steps can also leave behind dangling intermediate image layers.

---

## 2. Dangling Volumes

### What is a Dangling Volume?
A dangling volume is a storage volume that is **not mounted to any existing container** (neither running nor stopped).

### How Do Dangling Volumes Get Created?
- You launch a container that specifies an anonymous volume or a named volume (for instance, a database like PostgreSQL or MySQL that defines `VOLUME /var/lib/postgresql/data` in its Dockerfile).
- When you stop and delete the container using `docker rm <container_id>`, Docker deletes only the container metadata by default.
- Unless you explicitly specify the `-v` flag (`docker rm -v <container_id>`), the volume remains preserved on the host disk as an unattached, **dangling volume**.

---

## Dangling vs. Unused: What is the Difference?

It is important to understand the distinction between **dangling** and **unused** resources:

| Property | Dangling Resource | Unused Resource |
| :--- | :--- | :--- |
| **Has a Name / Tag?** | ❌ No (shows `<none>:<none>` or unreferenced ID) | ✅ Yes (e.g., `ubuntu:22.04` or `postgres:15`) |
| **Linked to a Container?** | ❌ No | ❌ No container currently runs it |
| **Safety to Delete** | 🟢 **100% Safe** — cannot be used directly anyway | ⚠️ Safe, but deleting means Docker must re-pull from registry if needed later |

---

## How to Find Dangling Resources

Docker provides built-in filter flags (`-f "dangling=true"`) across its CLI commands:

### 1. List Dangling Images
```bash
# View list of all dangling images
docker images -f "dangling=true"

# View only their IDs (useful for scripts)
docker images -f "dangling=true" -q
```

### 2. List Dangling Volumes
```bash
# View list of all dangling volumes
docker volume ls -f "dangling=true"

# View only the volume names
docker volume ls -f "dangling=true" -q
```

---

## How to Clean / Remove Dangling Resources

### 1. Remove Dangling Images Only
```bash
# Removes all untagged, dangling images
docker image prune
```
*Docker will prompt for confirmation before deleting.* To skip the confirmation prompt:
```bash
docker image prune -f
```

### 2. Remove Dangling Volumes Only
```bash
# Removes all anonymous and unattached named volumes
docker volume prune
```

> ⚠️ **Warning for Databases**: Ensure that you don't prune volumes that hold persistent data you intended to attach to a new container later!

### 3. Comprehensive Cleanup (`docker system prune`)
To clean up dangling images, stopped containers, and unused networks all at once:
```bash
docker system prune
```

If you also wish to include dangling volumes in the system prune:
```bash
docker system prune --volumes
```

---

## Summary Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Check disk space used by Docker** | `docker system df` |
| **Find dangling images** | `docker images -f "dangling=true"` |
| **Find dangling volumes** | `docker volume ls -f "dangling=true"` |
| **Delete dangling images** | `docker image prune` |
| **Delete dangling volumes** | `docker volume prune` |
| **Delete ALL unused images (not just dangling)** | `docker image prune -a` |
| **Full cleanup (images, containers, networks)** | `docker system prune` |
