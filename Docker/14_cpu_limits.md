# Docker CPU Limits
- Below command shows how to set CPU's at the time of starting a container.
  ```bash
  $ docker run --cpus="0.5" <image_name>
  ```
  In the above command , it will use 50% of CPU's to run the container.

  Example:
  ```bash
  $ docker run --rm -d --cpus="0.5" --name cpu_demo busybox sh -c "while true; do :; done"
  ```
  To know the stats of your container in the terminal
  ```bash
  $ docker stats cpu_demo
  ```
  Now you can see that the CPU usage is around 50%.

  To stop the container
  ```bash
  $ docker stop cpu_demo
  ```

- If you want to set shares of cpu for different containers run the following command
  - `--cpu-shares`: It will set the shares of cpu for different containers. Higher the value, higher the priority of the container to get CPU's.
  - `--cpuset-cpus`: It will set the cpus to be used by the container. It will use the cpus in the range you provide.
  ```bash
  $ docker run -d --rm --name=cpu_share_low --cpu-shares=512 --cpuset-cpus="0" busybox sh -c "while true; do :; done"

  $ docker run -d --rm --name=cpu_share_high --cpu-shares=1024 --cpuset-cpus="0" busybox sh -c "while true; do :; done"

  $ docker stats
  ```

- Now let's see CPU period and quota.
    - `--cpu-period`: The length of a CPU period in microseconds. Default is 100000 microseconds (100 ms).
    - `--cpu-quota`: The number of microseconds in each period that the container can use. Default is 0, which means no limit.

  Example:
    ```bash
    $ docker run -d --rm --cpu-period=100000 --cpu-quota=50000 <image_name>
    ```

