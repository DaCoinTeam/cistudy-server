export const keysConfig = () => (
    {
        ssl: {
            cert: process.env.SSL_CERT,
            key: process.env.SSL_KEY,
        }
    }
)