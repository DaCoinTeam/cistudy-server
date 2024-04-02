import { Injectable, OnModuleInit } from "@nestjs/common"
import { VerifyTransactionInput } from "./transactions.input"
import { WsResponse } from "@nestjs/websockets"
import { TRANSACTION_VERIFIED } from "./transaction.events"
import { VerifyTransactionOutputData } from "./transactions.output"
import { RedisClientType, createClient } from "redis"
import { databaseConfig } from "@config"

@Injectable()
export class TransactionsService implements OnModuleInit {
    pubClient: RedisClientType

    async onModuleInit() {
        this.pubClient = createClient({
            url: `redis://${databaseConfig().redis.host}:${databaseConfig().redis.port}`,
        })
        await this.pubClient.connect()
    }

    async verifyTransaction(
        input: VerifyTransactionInput,
    ): Promise<WsResponse<VerifyTransactionOutputData>> {
        const { client, data, userId } = input
        const { transactionHash } = data

        console.log(data)

        const message: TransactionsServiceMessage = {
            transactionHash,
            clientId: client.id,
            userId,
        }

        console.log(TransactionsService.name)
        await this.pubClient.publish(
            TransactionsService.name,
            JSON.stringify(message),
        )

        return { event: TRANSACTION_VERIFIED, data: {} }
    }
}

export interface TransactionsServiceMessage {
  transactionHash: string;
  clientId: string;
  userId: string;
}
