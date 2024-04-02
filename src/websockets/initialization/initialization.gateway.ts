import { Logger, UseGuards, UseInterceptors } from "@nestjs/common"

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
import { INITIALIZE } from "./initialization.events"
import { InitializeOutputData } from "./initialization.output"
import { InitializationService } from "./initialization.service"



@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class InitializationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(InitializationGateway.name)

    constructor(private readonly initializationService: InitializationService) { }

    @WebSocketServer()
    private readonly server: Server

    handleConnection(client: Socket) {
        this.logger.verbose(client.id)
    }

    async handleDisconnect(client: Socket) {
        await this.initializationService.handleDisconnect(client)
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @SubscribeMessage(INITIALIZE)
    async initialize(@ConnectedSocket() client: Socket, @UserId() userId: string) : Promise<WsResponse<InitializeOutputData>> {
        return this.initializationService.initialize({ 
            client,
            userId,
        })
    }
}