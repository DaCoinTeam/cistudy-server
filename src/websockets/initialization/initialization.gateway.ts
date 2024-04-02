import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Logger, UseGuards, UseInterceptors } from "@nestjs/common"
import { Cache } from "cache-manager"

import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { JwtAuthGuard } from "../shared"
import { UserId } from "../shared"
import { AuthInterceptor } from "../shared"

const INITIALIZE = "initialize"

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class InitializationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(InitializationGateway.name)

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    @WebSocketServer()
    private readonly server: Server

    handleConnection(client: Socket) {
        this.logger.verbose(client.id)
    }

    async handleDisconnect(client: Socket) {
        await this.cacheManager.del(client.id)
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @SubscribeMessage(INITIALIZE)
    async onInitialize(@ConnectedSocket() client: Socket, @UserId() userId: string) : Promise<WsResponse<unknown>> {
        await this.cacheManager.set(client.id, userId)
        return { event: INITIALIZE, data: {} }
    }
}