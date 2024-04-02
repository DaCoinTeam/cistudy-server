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
import { VerifyTransactionInputData } from "./transactions.input"
import {
    TransactionsService,
    TransactionsServiceMessage,
} from "./transaction.service"
import { TRANSACTION_VERIFIED, VERIFY_TRANSACTION } from "./transaction.events"
import { VerifyTransactionOutputData } from "./transactions.output"
import { RedisClientType, createClient } from "redis"
import { databaseConfig } from "@config"
import { Cache } from "cache-manager"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { BlockchainEvmService, BlockchainEvmServiceMessage } from "@schedulers"

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class TransactionsGateway implements OnModuleInit {
    private readonly logger = new Logger(TransactionsGateway.name)

    constructor(
    private readonly transactionsService: TransactionsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

  @WebSocketServer()
    private readonly server: Server

  redisClient: RedisClientType
  async onModuleInit() {
      this.redisClient = createClient({
          url: `redis://${databaseConfig().redis.host}:${databaseConfig().redis.port}`,
      })
      await this.redisClient.connect()

      this.redisClient.subscribe(
          TransactionsService.name,
          async (message: string) => {
              const parsed: TransactionsServiceMessage = JSON.parse(message)
              let blockchainEvmServiceMessages =
          ((await this.cacheManager.get(
              BlockchainEvmService.name,
          )) as Array<BlockchainEvmServiceMessage>) ?? []

              if (
                  blockchainEvmServiceMessages
                      .map(({ transactionHash }) => transactionHash)
                      .includes(parsed.transactionHash)
              ) {
                  this.server.sockets.to(parsed.clientId).emit(TRANSACTION_VERIFIED)
                  blockchainEvmServiceMessages = blockchainEvmServiceMessages.filter(
                      ({ transactionHash }) => transactionHash != parsed.transactionHash,
                  )
                  await this.cacheManager.set(
                      BlockchainEvmService.name,
                      blockchainEvmServiceMessages,
                  )
              } else {
                  const transactionsServiceMessages =
            ((await this.cacheManager.get(
                TransactionsService.name,
            )) as Array<TransactionsServiceMessage>) ?? []

                  await this.cacheManager.set(TransactionsService.name, [
                      ...transactionsServiceMessages,
                      parsed,
                  ])
              }
          },
      )

      this.redisClient.subscribe(
          BlockchainEvmService.name,
          async (message: string) => {
              const parsed: BlockchainEvmServiceMessage = JSON.parse(message)
              let transactionsServiceMessages =
          ((await this.cacheManager.get(
              TransactionsService.name,
          )) as Array<TransactionsServiceMessage>) ?? []

              const found = transactionsServiceMessages.find(
                  ({ transactionHash }) => transactionHash === parsed.transactionHash,
              )

              if (found) {
                  const { clientId } = found
                  this.server.sockets.to(clientId).emit(TRANSACTION_VERIFIED)
                  transactionsServiceMessages = transactionsServiceMessages.filter(
                      ({ transactionHash }) => transactionHash != parsed.transactionHash,
                  )
                  await this.cacheManager.set(
                      TransactionsService.name,
                      transactionsServiceMessages,
                  )
              } else {
                  const blockchainEvmServiceMessages =
            ((await this.cacheManager.get(
                BlockchainEvmService.name,
            )) as Array<BlockchainEvmServiceMessage>) ?? []

                  await this.cacheManager.set(BlockchainEvmService.name, [
                      ...blockchainEvmServiceMessages,
                      parsed,
                  ])
              }
          },
      )
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @SubscribeMessage(VERIFY_TRANSACTION)
  async verifyTransaction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
    @UserId() userId: string,
  ): Promise<WsResponse<VerifyTransactionOutputData>> {
      return await this.transactionsService.verifyTransaction({
          client,
          data: JSON.parse(data),
          userId,
      })
  }
}
