import { Logger, OnModuleInit } from "@nestjs/common"
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server } from "socket.io"
  
  @WebSocketGateway({
      cors: {
          origin: "*",
      },
  })
export class InitializationGateway implements OnModuleInit {
    private readonly logger = new Logger(InitializationGateway.name)

    @WebSocketServer()
    private readonly server: Server
    
    onModuleInit() {
        this.server.on("connection", (socket) => {
            this.logger.verbose(socket.id)
        })
    }
}