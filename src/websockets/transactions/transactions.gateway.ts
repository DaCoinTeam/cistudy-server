import {
    Inject,
    Logger,
    OnModuleInit,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"

import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { AuthInterceptor, JwtAuthGuard } from "../shared"
import { UserId } from "../shared"
import { TRANSACTION_VERIFIED, VERIFY_TRANSACTION } from "./transaction.events"
import { VerifyTransactionOutputData } from "./transactions.output"
import { RedisClientType, createClient } from "redis"
import { databaseConfig } from "@config"
import { Cache } from "cache-manager"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { BlockchainEvmService, BlockchainEvmServiceMessage } from "@schedulers"
import { VerifyTransactionInputData } from "./transactions.input"
import { Interval } from "@nestjs/schedule"
import { v4 as uuidv4 } from "uuid"

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class TransactionsGateway implements OnModuleInit {
    private readonly logger = new Logger(TransactionsGateway.name)

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {
    }

    @WebSocketServer()
    private readonly server: Server

    redisPubClient: RedisClientType
    redisTransactionsServiceSubClient: RedisClientType
    redisBlockchainEvmServiceSubClient: RedisClientType

    async onModuleInit() {
        this.redisPubClient = createClient({
            url: `redis://${databaseConfig().redis.host}:${databaseConfig().redis.port}`,
        })
        this.redisTransactionsServiceSubClient = this.redisPubClient.duplicate()
        this.redisBlockchainEvmServiceSubClient = this.redisPubClient.duplicate()

        await Promise.all([
            this.redisPubClient.connect(),
            this.redisTransactionsServiceSubClient.connect(),
            this.redisBlockchainEvmServiceSubClient.connect()
        ])

        this.redisTransactionsServiceSubClient.subscribe(
            TransactionsGateway.name,
            async (message: string) => {
                const parsed: TransactionsServiceMessage = JSON.parse(message)

                const transactionGatewayMessages =
                        ((await this.cacheManager.get(
                            TransactionsGateway.name,
                        )) as Array<TransactionsServiceMessage>) ?? []

                await this.cacheManager.set(TransactionsGateway.name, [
                    ...transactionGatewayMessages,
                    parsed,
                ])
            }
        )

        this.redisBlockchainEvmServiceSubClient.subscribe(
            BlockchainEvmService.name,
            async (message: string) => {
                console.log(message)
                const parsed: BlockchainEvmServiceMessage = JSON.parse(message)

                const blockchainEvmServiceMessages =
                        ((await this.cacheManager.get(
                            BlockchainEvmService.name,
                        )) as Array<BlockchainEvmServiceMessage>) ?? []

                await this.cacheManager.set(BlockchainEvmService.name, [
                    ...blockchainEvmServiceMessages,
                    parsed,
                ])
            }
        )
    }

        @Interval(5000)
    async verifyTransactions() {
        let [blockchainEvmServiceMessages, transactionGatewayMessages] = await Promise.all([
                this.cacheManager.get(BlockchainEvmService.name) as Promise<Array<BlockchainEvmServiceMessage>>,
                this.cacheManager.get(TransactionsGateway.name) as Promise<Array<TransactionsServiceMessage>>
        ])

        blockchainEvmServiceMessages = blockchainEvmServiceMessages ?? []
        transactionGatewayMessages = transactionGatewayMessages ?? []

        transactionGatewayMessages.forEach(async ({ transactionHash, clientId }) => {
            if (!blockchainEvmServiceMessages.map(({ transactionHash: hash }) => hash).includes(transactionHash)) return

            //1 min to verify transaction
            const code = uuidv4()
            await this.cacheManager.set(code, {
                transactionHash
            }, 60000)

            this.server.to(clientId).emit(TRANSACTION_VERIFIED, { code })

            blockchainEvmServiceMessages = blockchainEvmServiceMessages.filter(
                ({ transactionHash: hash }) => hash != transactionHash
            )
            transactionGatewayMessages = transactionGatewayMessages.filter(
                ({ transactionHash: hash }) => hash != transactionHash
            )

            await Promise.all([
                this.cacheManager.set(
                    BlockchainEvmService.name,
                    blockchainEvmServiceMessages,
                ),
                this.cacheManager.set(
                    TransactionsGateway.name,
                    transactionGatewayMessages,
                )]
            )
        })
    }

        @UseGuards(JwtAuthGuard)
        @UseInterceptors(AuthInterceptor)
        @SubscribeMessage(VERIFY_TRANSACTION)
        async handleVerifyTransaction(
            @ConnectedSocket() client: Socket,
            @MessageBody() data: VerifyTransactionInputData,
            @UserId() userId: string,
        ): Promise < WsResponse < VerifyTransactionOutputData >> {
            console.log("C")
            const { transactionHash } = data

            const message: TransactionsServiceMessage = {
                transactionHash,
                clientId: client.id,
                userId,
            }

            await this.redisPubClient.publish(
                TransactionsGateway.name,
                JSON.stringify(message),
            )

            return { event: VERIFY_TRANSACTION, data: {} }
        }
}

export interface TransactionsServiceMessage {
    transactionHash: string;
    clientId: string;
    userId: string;
}