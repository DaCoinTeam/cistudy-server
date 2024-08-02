import { Inject, Logger } from "@nestjs/common"

import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from "@nestjs/websockets"

import { Server, Socket } from "socket.io"
import { INITIALIZE, INITIALIZED } from "./initialization.events"
import { InitializeOutputData } from "./initialization.output"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { Interval } from "@nestjs/schedule"
import { InjectRepository } from "@nestjs/typeorm"
import { NotificationMySqlEntity } from "@database"
import { Repository } from "typeorm"
import { uuidV4 } from "web3-utils"

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class InitializationGateway
implements OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger = new Logger(InitializationGateway.name)

    constructor(
    @InjectRepository(NotificationMySqlEntity)
    private readonly notificationMySqlRepository: Repository<NotificationMySqlEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    ) {}

  @WebSocketServer()
    private readonly server: Server

  handleConnection(client: Socket) {
      this.logger.verbose(client.id)
  }

  async handleDisconnect(client: Socket) {
      const accountId = (await this.cacheManager.get(client.id)) as string
      if (accountId) {
          let clientIds = (await this.cacheManager.get(accountId)) as Array<string>
          clientIds = clientIds.filter((clientId) => clientId !== client.id)
          await this.cacheManager.set(accountId, clientIds)
      }
      await this.cacheManager.del(client.id)
  }

  @SubscribeMessage(INITIALIZE)
  async handleInitialize(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: InitializeBody,
  ): Promise<WsResponse<InitializeOutputData>> {
      const { accountId } = body
      const clientIds =
      ((await this.cacheManager.get(accountId)) as Array<string>) ?? []
      await this.cacheManager.set(accountId, [...clientIds, client.id])
      await this.cacheManager.set(client.id, accountId)
      return { event: INITIALIZED, data: "Connected" }
  }

  @Interval(1000)
  async publish() {
      const notifications = await this.notificationMySqlRepository.find({
          where: {
              isPublished: false,
          },
      })

      for (const notification of notifications) {
          const { receiverId } = notification
          const clientIds =
        ((await this.cacheManager.get(receiverId)) as Array<string>) ?? []

          const promises: Array<Promise<void>> = []
          for (const clientId of clientIds) {
              const promise = async () => {
                  await this.notificationMySqlRepository.update(
                      notification.notificationId,
                      {
                          isPublished: true,
                      },
                  )
                  this.server.to(clientId).emit("notifications", uuidV4())
              }
              promises.push(promise())
          }
          await Promise.all(promises)
      }
  }
}

export interface InitializeBody {
  accountId: string
}
