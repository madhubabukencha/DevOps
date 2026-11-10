# Memory Limits

This document explains memory limits in Docker containers.

- If you run `docker stats`, it will show the `MEM USAGE / LIMIT`:
  ```bash
  $ docker stats
  ```

- Our MongoDB container needs approximately 82 MB of memory:
  ```bash
  $ docker run -d --rm --name=mongodb mongodb/mongodb-community-server:7.0.0-ubuntu2204
  ```

  If you set `--memory` to less than that, you will notice that your container fails with an Out-Of-Memory (OOM) error:
  ```bash
  $ docker run -d --name=mongodb --memory="20m" mongodb/mongodb-community-server:7.0.0-ubuntu2204
  ```

  You can see that your container has exited:
  ```
  PS D:\DevOps> docker ps -a
  CONTAINER ID   IMAGE                                               COMMAND                  CREATED          STATUS                     PORTS     NAMES
  b5bbcdb9e884   mongodb/mongodb-community-server:7.0.0-ubuntu2204   "python3 /usr/local/…"   15 seconds ago   Exited (1) 9 seconds ago             mongodb 
  ```

  If you run `docker inspect`, you will notice `"OOMKilled": true`:
  ```bash
  $ docker inspect mongodb
  ```

  Output:
  ```json
   "State": {
            "Status": "exited",
            "Running": false,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": true,
            "Dead": false,
            "Pid": 0,
            "ExitCode": 1,
  ```

- Setting reserved memory for a container:
  - `--memory-reservation="<value>"`: Reserves memory for the container (soft limit). This is not a strict minimum; a container can use more than the reserved amount if system resources are available.
  - `--memory="<value>"`: The maximum amount of memory (hard limit) the container can utilize.

  ```bash
  $ docker run -d --name=mongodb --memory-reservation="80m" --memory="100m" mongodb/mongodb-community-server:7.0.0-ubuntu2204

  $ docker stats
  ```

- Understanding Swap memory:
  Swap is hard disk storage that the container uses when its memory limit is reached. Note that `--memory-swap` specifies the total amount of memory plus swap.
  ```bash
  $ docker run -d --name=mongodb --memory="20m" --memory-swap=2g mongodb/mongodb-community-server:7.0.0-ubuntu2204
  ```
