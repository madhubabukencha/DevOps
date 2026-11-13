# Bridge Network
This is the **default** network type in Docker. It is created automatically when Docker is installed.

- The `docker network inspect bridge` command shows bridge details in JSON format. This JSON format contains a section called `containers`, which shows the list of containers that are using the bridge network.
  ```bash
  $ docker run -d --name webserver nginx:1.27.0
  $ docker network inspect bridge
  ```

- If you are using the bridge network, you would not be able to connect to other containers by name.

- Now we will establish communication between two containers
  - Run the below command and copy webserver IP address
    ```bash
    $ docker inspect webserver
    ```
  - Now start another container with sh and enter below commands
    ```bash
    $ docker run -it ubuntu:24.04 sh
    ```
    Commands:
    ``` bash
    # To update packages
    $ apt update && apt upgrade
    # To install curl, it is required to communicate with other server
    $ apt install curl
    # To connect webserver. You will be able to see html content of the nginx webserver
    $ curl <webserver_ip_address>
    # But if you try to access it through name then you will run into issues
    # curl: (6) Could not resolve host: webserver
    $ curl webserver
    ```
