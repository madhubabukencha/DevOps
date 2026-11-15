# User Defined Networks
In this section, we are going to create our own Docker network and connect it to a container.

- To know the commands available for managing networks, you can run `docker network --help`.

- We use `docker network create <network-name>` command to create a user-defined network. You can also run `docker network create --help` to know more details about the `create` command.

- Now we will create a network with the name **madhu-net**:
  ```bash
  $ docker network create madhu-net
  # To list the networks
  $ docker network ls
  ```

- If you want to see the config of the created network, you can run the inspect command:
  ```bash
  $ docker network inspect madhu-net
  ```
  By default, user-created networks use the **Bridge** driver and the **Containers** section will be empty since we have not attached it to any container yet.

- We can connect a network to a container in two different ways.
  - **Approach-1**
    - We can attach it to the container using the `connect` argument.
      ```bash
      $ docker run -d --name webserver nginx:1.27.0
      # Connecting madhu-net to the webserver container
      $ docker network connect madhu-net webserver
      ```
    - If you inspect the **webserver** container, you will notice **madhu-net** attached under Networks along with the default **Bridge** network. The default network is still present because we did not specify any network while creating the container. Also, if you inspect **madhu-net**, you will notice **webserver** added to the containers list.
  - **Approach-2**
    - We attach the network while creating the container itself:
      ```bash
      $ docker run -it --network madhu-net --name alpine-server alpine:3.20 sh
      # Execute the following command in the shell
      $ apk add curl
      # You can now connect to the webserver (using its name) with the curl command
      $ curl webserver
      ```

- Finally, to remove a network, execute the following command. Make sure no container is attached to this network first.
  ```bash
  $ docker network rm madhu-net
  ```



