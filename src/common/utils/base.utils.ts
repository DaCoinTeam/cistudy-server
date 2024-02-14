import { appConfig } from "@config"
import { existsSync, promises as fsPromises } from "fs"

const CLIENT_ID = "client-id"
export const getClientId = (request: Request) =>
  request.headers[CLIENT_ID] as string | undefined

export const getEnvValue = (values: {
  development: string;
  production?: string;
}): string => {
    const { development, production } = values
    switch (appConfig().node) {
    case "production":
        return production
    default:
        return development
    }
}

export const makeDirectoryIfNotExisted = async (directory: string) => {
    if (!existsSync(directory)) {
        await fsPromises.mkdir(directory, { recursive: true })
    }
}
