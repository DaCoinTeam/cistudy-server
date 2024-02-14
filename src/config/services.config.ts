export const servicesConfig = () => (
    {
        firebase: {
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        },
        mailer: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS
        }
    })