# Memory Limits
This document provides an idea about Memory limit in the docker containers.

- If you run docker stats it will show the `MEM UASAGE / LIMIT`.
  ```bash
  $ docker stats
  ```
- Our mongodb container need exactly 82M of memory.
  ```bash
  $ docker run -d --rm --name=mongodb mongodb/mongodb-community-server:7.0.0-ubuntu2204
  ```

  If you set `--memory` less than that you will notice that you container fails with Out-Of-Memory issue
  ```bash
  $ docker run -d --name=mongodb --memory="20m" mongodb/mongodb-community-server:7.0.0-ubuntu2204
  ```

  You can notice your container Existed below error:
  ```
  PS D:\DevOps> docker ps -a
  CONTAINER ID   IMAGE                                               COMMAND                  CREATED          STATUS                     PORTS     NAMES
  b5bbcdb9e884   mongodb/mongodb-community-server:7.0.0-ubuntu2204   "python3 /usr/local/…"   15 seconds ago   Exited (1) 9 seconds ago             mongodb 
  ```
  If you run docker inspect then you can notice `OOMKilled: True`
  ```bash
  $ docker inspect mongodb
  ```
  Log:
  ```
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

- Now you can set a reserved memory for the container
  - `--memory-reservation="value"`: It will reserves the memory for our container. Reservation is not the minimum limit. A Container might use more than reserved.
  - `--memory=<value>`:It is the value of max momery a container can utilise.

  ```bash
  $  docker run -d --name=mongodb --memory-reservation="80M" --memory="100m" mongodb/mongodb-community-server:7.0.0-ubuntu2204

  $ docker stats
  ```

- Now you will understand about SWAP memory. It is a hard disk storage that the container uses when the memory limit is reached.
  ```bash
  $ docker run -d --name=mongodb  --memory="20m" --memory-swap=2g mongodb/mongodb-community-server:7.0.0-ubuntu2204
  ```



 





