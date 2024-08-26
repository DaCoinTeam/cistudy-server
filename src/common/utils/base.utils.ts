import { appConfig } from "@config"
import { existsSync, promises as fsPromises } from "fs"
import mime from "mime-types"

export const CLIENT_ID = "client-id"

export const getClientId = (headers: Headers) =>
  headers[CLIENT_ID] as string | undefined

export const getEnvValue = <T = string>(values: {
  development?: T
  production?: T
}): T => {
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

export const sleep = (ms: number = 0) =>
    new Promise((resolve) => setTimeout(resolve, ms))

export const shuffleArray = <T>(array: Array<T>) : Array<T> => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

export const randomPassword = () => {
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowerCase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const allCharsNoSpecial = upperCase + lowerCase + numbers
  
    let result = ""

    result += upperCase[Math.floor(Math.random() * upperCase.length)]
  

    result += specialChars[Math.floor(Math.random() * specialChars.length)]

    for (let i = 0; i < 6; i++) {
        result += allCharsNoSpecial[Math.floor(Math.random() * allCharsNoSpecial.length)]
    }

    return result.split("").sort(() => Math.random() - 0.5).join("")
}

export const skipAndTakeArray =  <T>(array: Array<T>, skip : number, take: number) : Array<T> => {
    const skippedArray = array.slice(skip)
    const resultArray = skippedArray.slice(0, take)
    return resultArray
}
