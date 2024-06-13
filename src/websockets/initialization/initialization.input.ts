import { WsAuthEmptyInput } from "@common"
import { Socket } from "socket.io"

export class InitializeInput implements WsAuthEmptyInput {
    accountId: string
    client: Socket
}