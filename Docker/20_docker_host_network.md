# 🐳 Docker `host` Network

## What is it?

The **`host` network** is a Docker networking mode where a container **shares the network stack directly with the Docker host** — no network isolation, no port mapping needed.

> The container uses the host's IP, interfaces, and ports **as if it were a process running directly on the host**.

---

## Docker Network Modes (Quick Comparison)

| Mode | Isolation | Port Mapping | Use Case |
|---|---|---|---|
| `bridge` *(default)* | ✅ Isolated | Required (`-p`) | General purpose |
| **`host`** | ❌ None | Not needed | High performance |
| `none` | ✅ Full | N/A | No networking |
| `overlay` | ✅ Isolated | Optional | Docker Swarm/multi-host |

---

## How `bridge` vs `host` Differs

### 🌉 Bridge Network (default)
```
Host (192.168.1.10)
  └── Docker bridge (172.17.0.1)
        └── Container (172.17.0.2:80)
                ↑
         Port mapping needed:
         docker run -p 8080:80 nginx
         → access via host:8080
```

### 🖥️ Host Network
```
Host (192.168.1.10)
  └── Container shares host network
        └── Container binds to port 80
                ↑
         No mapping needed:
         docker run --network host nginx
         → access via host:80 directly
```

---

## Basic Usage

```bash
# Run a container using host network
docker run --network host nginx

# Check networks available
docker network ls

# Inspect the host network
docker network inspect host
```

---

## ✅ Advantages

- **Better performance** — no NAT overhead
- **No port mapping** required
- Useful for apps that need to **bind to many ports dynamically**

## ❌ Disadvantages / Limitations

- **No network isolation** — container can access all host ports
- **Port conflicts** — container and host share the same ports
- **Linux only** — `host` network mode does **not work on Docker Desktop for Windows/macOS** (since containers run inside a Linux VM there)

---

## 📌 Common Use Cases

| Use Case | Why `host` helps |
|---|---|
| Network monitoring tools | Need raw access to host interfaces |
| High-throughput services | Avoid NAT latency |
| Legacy apps with hardcoded ports | No remapping hassle |
| `dockerd` metrics / Prometheus | Scrape host-level metrics directly |

---

## 🛠️ How to Learn More (Hands-on)

```bash
# 1. Run nginx on host network
docker run --rm --network host nginx

# 2. From your host, check if port 80 is now live
curl http://localhost:80

# 3. See that the container has the same IP as your host
docker run --rm --network host alpine ip addr
```

> **⚠️ Warning:** On **Windows/macOS with Docker Desktop**, `--network host` is silently ignored or limited — it only works natively on **Linux**.

> **💡 Tip:** To truly practice host networking, use a **Linux VM** or a cloud instance (e.g., EC2, GCP VM) with Docker installed.

