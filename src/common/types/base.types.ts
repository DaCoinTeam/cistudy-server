import { AuthTokens } from "./auth.types"

export interface Output<T> {
    data: T,
    tokens?: AuthTokens
}

export interface WsOutput<T> {
    event: string,
    data: Output<T>
}


export interface AuthInput<T> {
    userId: string,
    data: T,
    files?: Array<Express.Multer.File>
}

export interface Input<T> {
    data: T,
    files?: Array<Express.Multer.File>
}

export interface AuthEmptyDataInput {
    userId: string,
    files?: Array<Express.Multer.File>
}

export interface ParamsWithOptions<T, K> {
    params: T,
    options?: K
}

export interface ParamsOnly<T> {
    params: T
}

export interface OptionsOnly<T> {
    options?: T
}

export interface ResultsWithMetadata<T, K> {
    results: Array<T>,
    metadata?: K
}

export type EmptyObject = NonNullable<unknown>