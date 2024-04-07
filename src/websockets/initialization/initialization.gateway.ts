import { Inject, Logger, UseGuards, UseInterceptors } from "@nestjs/common"

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
import { INITIALIZE, INITIALIZED } from "./initialization.events"
import { InitializeOutputData } from "./initialization.output"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"

@WebSocketGateway({
    cors: {
        origin: "*",
    },
    
})
export class InitializationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(InitializationGateway.name)

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

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
    async handleInitialize(@ConnectedSocket() client: Socket, @UserId() userId: string): Promise<WsResponse<InitializeOutputData>> {
        await this.cacheManager.set(client.id, userId)
        return { event: INITIALIZED, data: {} }
    }
}