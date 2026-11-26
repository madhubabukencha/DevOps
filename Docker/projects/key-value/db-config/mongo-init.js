/**
 * File name is important. Mongodb wants this kind of filename
 * 
 */
// Create environment variables
const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_DATABASE = process.env.MONGODB_DATABASE

// Setting up config
db = db.getSiblingDB(MONGODB_DATABASE)
db.createUser(
    {
        user: MONGODB_USERNAME,
        pwd: MONGODB_PASSWORD,
        roles: [
            {
                role: 'readWrite',
                db: MONGODB_DATABASE
            }
        ]
    }
)