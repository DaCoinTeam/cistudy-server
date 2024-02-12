import { AuthTokens } from "./auth.definition"

export interface IOutput<T> {
    data: T,
    tokens: AuthTokens 
}

export interface IAuthInput<T> {
    userId: string,
    data: T,
    files?: Array<Express.Multer.File>
}

export interface IInput<T> {
    data: T,
    files?: Array<Express.Multer.File>
}

export interface IFileInput {
    userId: string,
    files: Array<Express.Multer.File>
}