import { WsException } from "@nestjs/websockets"

export const UnauthorizedWsException = (callback: WsCallback) => {
    const error: WsError = {
        callback,
        status: WsErrorStatus.Unauthorized
    }
    return new WsException(error)
}

export interface WsCallback {
    event: string,
    data: unknown
}

export interface WsError {
    callback: WsCallback,
    status: WsErrorStatus
}

export enum WsErrorStatus {
    Unauthorized = 0
}