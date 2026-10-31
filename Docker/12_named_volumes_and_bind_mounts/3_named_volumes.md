# Named Volumes

## What is a Named Volume?

A **Named Volume** is a dedicated, persistent storage space managed entirely by Docker on your host machine and given a custom, human-friendly name (such as `db_data` or `app_logs`).

### Plain English Explanation
Think of a container like a rental car and a named volume like a **personal storage locker**:
- You can rent a car (run a container), drive around, and park it.
- If the car breaks down or your rental period ends, you return or scrap the car (delete the container).
- All your important belongings remain safely locked inside your storage locker (the named volume).
- When you rent a new, updated car tomorrow (new container version), you simply unlock the same storage locker and attach it to your new car. Your stuff is right where you left it.

---

## Why Use Named Volumes? (Key Advantages)

1. **Docker Manages the Location**: Unlike bind mounts where you must specify an exact path on your computer (like `D:\DevOps\my-data`), Docker decides where to store named volumes safely behind the scenes (e.g., inside Docker's internal data directory `/var/lib/docker/volumes/`).
2. **Survives Container Lifecycle**: Containers can be stopped, restarted, upgraded, or deleted. The named volume remains untouched until you explicitly delete it with `docker volume rm`.
3. **Sharing Between Containers**: Multiple containers can attach to the same named volume at the same time (either read-write or read-only).
4. **Automatic Initial Population**: If a container image already has files inside the directory where you mount an empty named volume, Docker automatically copies those files into your volume!
5. **Cross-Platform Consistency**: Because Docker handles the paths and permissions internally, named volumes work reliably across Linux, macOS, and Windows (without filesystem permission quirks or path formatting issues).

---

## Syntax and Core Commands

### 1. Mounting a Named Volume to a Container
You attach a named volume using either the `-v` (shorthand) or `--mount` (explicit) flag:

```bash
# Using -v (recommended for CLI)
docker run -d -v <volume_name>:<container_path> --name <container_name> <image_name>

# Using --mount (more verbose)
docker run -d --mount source=<volume_name>,target=<container_path> --name <container_name> <image_name>
```

> **Note**: If `<volume_name>` does not exist yet, Docker automatically creates it for you when you run the command!

### 2. Managing Volumes Directly

| Action | Command |
| :--- | :--- |
| **Create a volume** | `docker volume create my_data` |
| **List all volumes** | `docker volume ls` |
| **Inspect volume details (host path, labels)** | `docker volume inspect my_data` |
| **Remove an unused volume** | `docker volume rm my_data` |
| **Delete all unused volumes** | `docker volume prune` |

---

## Simple Case Studies

### Case Study 1: The Database Upgrade (Data Safety Test)
**The Scenario:** You are running a PostgreSQL database for a web app. You want to upgrade PostgreSQL from version 15 to version 16 without losing user records.

#### Step 1: Run PostgreSQL with a named volume
We name our volume `postgres_data` and mount it to Postgres's standard data directory `/var/lib/postgresql/data`:

```bash
docker run -d \
  --name db-v1 \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15
```

#### Step 2: Add some sample data into the database
```bash
docker exec -it db-v1 psql -U postgres -c "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(50));"
docker exec -it db-v1 psql -U postgres -c "INSERT INTO users (name) VALUES ('Alice'), ('Bob');"
```

#### Step 3: Destroy the container completely!
Simulate an upgrade or container crash by forcefully deleting `db-v1`:
```bash
docker rm -f db-v1
```
*At this point, the container is gone forever.*

#### Step 4: Launch a brand-new container using the new image version
Attach the new container to the exact same named volume `postgres_data`:
```bash
docker run -d \
  --name db-v2 \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16
```

#### Step 5: Verify data integrity
```bash
docker exec -it db-v2 psql -U postgres -c "SELECT * FROM users;"
```
**Result:** Alice and Bob are still there! The database logic was completely replaced, but the data remained safe inside the named volume.

---

### Case Study 2: Protecting `node_modules` during Live Development
**The Scenario:** You are developing a Node.js / React application. You use a bind mount (`-v D:\my-app:/app`) so that your local code edits reflect inside the container instantly.

**The Problem:**
Your host machine does not have `node_modules` installed (or it has Windows binaries), while the container built Linux-compatible binaries inside `/app/node_modules`. The bind mount would overwrite the container's `/app` folder with the host folder, wiping or breaking `node_modules`.

**The Solution:**
Combine a bind mount for source code with a **named volume** for `node_modules`:

```bash
docker run -d \
  -p 3000:3000 \
  -v D:\my-app:/app \
  -v node_modules_cache:/app/node_modules \
  --name my-react-dev \
  my-react-image
```

**How Docker solves this:**
- `-v D:\my-app:/app` syncs your code from Windows to the container.
- `-v node_modules_cache:/app/node_modules` instructs Docker to prioritize the named volume for `/app/node_modules`.
- The container's dependencies remain safe, isolated, and high-performing inside the named volume without being overwritten by your host folder.

---

### Case Study 3: Shared Storage Between Two Containers (Producer & Consumer)
**The Scenario:** You have a Web Server generating access logs, and a Log Analyzer / Background Worker that parses logs and generates analytics reports.

#### Step 1: Create a shared named volume
```bash
docker volume create shared_web_logs
```

#### Step 2: Run the Web Server (The Producer)
Mount the volume to where the web server saves its access logs:
```bash
docker run -d \
  --name web_server \
  -v shared_web_logs:/var/log/nginx \
  nginx:alpine
```

#### Step 3: Run the Log Worker (The Consumer)
Mount the exact same volume to the worker container in **read-only** mode (`:ro`) so it cannot accidentally alter or delete the live logs:
```bash
docker run -d \
  --name log_worker \
  -v shared_web_logs:/input_logs:ro \
  my-log-analyzer-image
```

**Result:**
The web server writes logs to the named volume, and the log worker reads them simultaneously in real time. Neither container needs to know about the other's internal architecture, and neither relies on files living on your host machine.

---

## Named Volumes vs Bind Mounts: Quick Comparison

| Feature | Named Volume (`-v my_vol:/path`) | Bind Mount (`-v /host/dir:/path`) |
| :--- | :--- | :--- |
| **Managed by** | Docker Engine | Host Operating System / User |
| **Location on Host** | Docker-managed storage (`/var/lib/docker/volumes/...`) | Any arbitrary path you choose on your machine |
| **Portability** | High (works identically across Linux, Windows, macOS) | Lower (depends on host folder structure & file permissions) |
| **Initial Content** | Automatically copies files from image if volume is empty | Host folder overwrites container folder |
| **Best For** | Databases, stateful apps, container-to-container sharing | Local live development (hot reload, editing code in IDE) |
