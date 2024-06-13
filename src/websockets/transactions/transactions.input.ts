import { WsAuthInput } from "@common"
import { Socket } from "socket.io"

export class VerifyTransactionInputData {
    transactionHash: string
}

export class VerifyTransactionInput implements WsAuthInput<VerifyTransactionInputData> {
    client: Socket
    accountId: string
    data: VerifyTransactionInputData
} 