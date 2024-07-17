export const keysConfig = () => (
    {
        ssl: {
            cert: process.env.SSL_CERT,
            key: process.env.SSL_KEY,
        },
        paypal: {
            clientId: process.env.PAYPAL_CLIENT_ID,
            secretKey: process.env.PAYPAL_SECRET_KEY
        }
    }
)