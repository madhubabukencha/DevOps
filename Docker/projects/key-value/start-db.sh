# If you are running this script in Windows machine then choose
# Ubuntu or git bash terminal instead of pwsh
MONGO_DB_IMAGE="mongodb/mongodb-community-server"
MONGO_DB_TAG="7.0.0-ubuntu2204"
CONTAINER_NAME="mongodb"

# Mongodb credentials
ROOT_USER="root-user"
ROOT_PASSWORD="root-password"

# Defining Mongodb key-value db credentails
KEY_VALUE_USER="key-value-user"
KEY_VALUE_PASSWORD="key-value-password"
KEY_VALUE_DATABASE="key-value-database"

docker run --rm -d --name $CONTAINER_NAME \
 -e MONGODB_INITDB_ROOT_USERNAME=$ROOT_USER \
 -e MONGODB_INITDB_ROOT_PASSWORD=$ROOT_PASSWORD \
 -e MONGODB_USERNAME=$KEY_VALUE_USER \
 -e MONGODB_PASSWORD=$KEY_VALUE_PASSWORD \
 -e MONGODB_DATABASE=$KEY_VALUE_DATABASE \
 -v ./db-config/mongo-init.js:/docker-entrypoint-init.d/mongo-init.js:ro \
 $MONGO_DB_IMAGE:$MONGO_DB_TAG

