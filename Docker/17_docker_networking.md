# Docker Networking
This document provides a basic theoretical knowledge about **Docker Networking**.

## Introduction to Docker Networking
Docker uses a networking layer that allows containers to communicate with each other and with the host system.

## Types of Docker Networks
Docker provides different types of networks for different use cases.

### 1. Bridge Network
- Bridge network is the **default** network type in Docker.
- It is created automatically when Docker is installed.
- It is used to connect containers running on the **same host**.
- Containers on a bridge network are isolated from the host system.
- It uses NAT (Network Address Translation) to allow containers to communicate with the outside world.

### 2. Host Network
- Host network removes the network isolation between the container and the Docker host.
- The container **shares the host's network stack** directly (no separate IP is assigned).
- It offers better network performance since there is no NAT overhead.
- It is suitable when a container needs to handle high-throughput or low-latency networking.
- Not recommended for general use due to reduced isolation.

### 3. Overlay Network
- Overlay network is used to connect containers running on **different hosts** (multi-host networking).
- It is commonly used with **Docker Swarm** or other orchestration tools.
- It creates a distributed network on top of host-specific networks.
- Containers on an overlay network can communicate securely across hosts.

### 4. None Network
- The `none` network completely **disables networking** for a container.
- The container has no access to external networks or other containers.
- It is used for maximum isolation, batch jobs, or security-sensitive workloads.
- The container only has a loopback interface (`lo`).

## Docker Networking Commands
- `docker network ls` — Lists all networks in Docker.
- `docker network inspect <network_name>` — Inspects a network.
- `docker network create <network_name>` — Creates a new network.
- `docker network rm <network_name>` — Removes a network.
- `docker network connect <network_name> <container_name>` — Connects a container to a network.
- `docker network disconnect <network_name> <container_name>` — Disconnects a container from a network.

## Docker Networking Best Practices
- Use **bridge networks** for most single-host use cases.
- Use **host networks** only when network performance is critical and isolation is acceptable.
- Use **overlay networks** for multi-host deployments and orchestrated environments.
- Use **none network** when a container requires complete network isolation.
- Use separate networks for different applications to limit blast radius.