import { appConfig } from "@config"
import { existsSync, promises as fsPromises } from "fs"
import mime from "mime-types"

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

export const existKeyNotUndefined = (object: object) => {
    for (const key in object) {
        if (object[key] !== undefined) {
            return true
        }
    }
    return false
}

export const getContentType = (filenameOrExt: string): string | undefined => {
    const contentType = mime.contentType(filenameOrExt)
    return contentType ? contentType : undefined
}