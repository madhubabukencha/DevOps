# Docker Restart Policies
This document explains various Docker restart policies.

- Below container exists with 1. Since it does not have any restart policy it wouldn't restart. You can check it's status with `docker ps -a`
  ```bash
  $ docker run -d --name no_restart busybox sh -c "sleep 3; exit 1"
  ```

- Now we will add a restart policy `on-failure`. It will restart the container whenever it fails with **non-zero** exit code. It will run for forever since docker daemon restart the container each time wheneven it fails with non-zero status. So, make sure after inspecting delete the container.
  ```bash
  $ docker run -d --name restart_fail --restart on-failure busybox sh -c "sleep 3; exit 1"
  ```
  Inspect the container with `$ docker inspect restart_fail`. You will found output something like below:
  ```text
  "Name": "/restart_fail",
  "RestartCount": 9,
  "Driver": "overlayfs",
  ```

- To restrict number of re-tries you can run below command
  ```bash
   docker run -d --name restart_fail --restart on-failure:5 busybox sh -c "sleep 3; exit 1"
  ```

- If you want, your container to restart irrespective of its exit code then we need to use `always` instead of `on-failure`.
  ```bash
  $ docker run -d --name restart_always --restart always busybox sh -c "sleep 3; exit 1"
  ```
  > NOTE:
  > The container stops if you run `docker stop restart_always` but it will start automatically again if your docker deamons restarts and runs infinitely.

- Run below command if you wants to stop the container when you run `docker stop` command and not to restart wheneven docker deamon restarts.
  ```bash
  $ docker run -d --name restart_unless_stopped --restart unless-stopped busybox sh -c "sleep 3; exit 1"
  ```




