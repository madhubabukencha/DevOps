# Project Key-Value
We are going to a create a project by running various containers together.

## Mongodb Setup
- Download the mongodb image
  ```bash
  $ docker run -d --name mongodb mongodb/mongodb-community-server:7.0.0-ubuntu2204
  ```
- Conform weather it is running or not by checking mongodb logs.
  ```bash
  $ docker logs mongodb
  ```

- You can even run mongo shell by executing below command
  ```
  $ docker exec -it mongodb mongosh
  ```
  Output:
  ```
  test> showdbs
  ReferenceError: showdbs is not defined
  test> show dbs
  admin   40.00 KiB
  config  12.00 KiB
  local   40.00 KiB

  test> use admin;
  switched to db admin

  admin> show collections;
  system.version

  admin>
  (To exit, press Ctrl+C again or Ctrl+D or type .exit)
  adm  in>
  ```

- Now instead of running all the above commands independently, we are going to create a 
  a shell script and going to place all the commands there.
  - start-db.sh
    ```bash
    # If you are running this script in Windows machine then choose
    # Ubuntu or git bash terminal instead of pwsh
    MONGO_DB_IMAGE="mongodb/mongodb-community-server"
    MONGO_DB_TAG="7.0.0-ubuntu2204"
    CONTAINER_NAME="mongodb"

    # Mongodb credentials
    ROOT_USER="root-user"
    ROOT_PASSWORD="root-password"


    docker run --rm -d --name $CONTAINER_NAME \
    -e MONGODB_INITDB_ROOT_USERNAME=$ROOT_USER \
    -e MONGODB_INITDB_ROOT_PASSWORD=$ROOT_PASSWORD \
    $MONGO_DB_IMAGE:$MONGO_DB_TAG
    ```
  - At this point, if you try to perform some git commands it will throw an error
    ```bash
    docker exec -it mongodb mongosh
    ```

    Interactive terminal logs:
    ```
    test> show dbs;
    MongoServerError[Unauthorized]: Command listDatabases requires authentication
    ```
    

  