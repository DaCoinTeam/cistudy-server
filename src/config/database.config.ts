export const databaseConfig = () =>
    ({
        mysql: {
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            schema: process.env.MYSQL_SCHEMA,
            host: process.env.MYSQL_HOST,
            port: Number.parseInt(process.env.MYSQL_PORT),
        },
        redis: {
            host: process.env.REDIS_HOST,
            port: Number.parseInt(process.env.REDIS_PORT)
        },
        mongo: {
            user: process.env.MONGO_USER,
            pass: process.env.MONGO_PASS,
            dbName: process.env.MONGO_DB_NAME,
            host: process.env.MONGO_HOST,
            port: process.env.MONGO_PORT
        }
    })
