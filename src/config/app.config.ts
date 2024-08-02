export const appConfig = () => (
    {
        port: process.env.PORT,
        url: process.env.URL,
        node: process.env.NODE_ENV,
        frontendUrl: process.env.FRONTEND_URL,
    })

