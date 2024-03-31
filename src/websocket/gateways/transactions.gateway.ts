import { Logger, OnModuleInit } from "@nestjs/common"
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from "@nestjs/websockets"
import { from, Observable } from "rxjs"
import { map } from "rxjs/operators"
import { Server } from "socket.io"
  
  @WebSocketGateway({
      cors: {
          origin: "*",
      },
  })
export class TransactionsGateway implements OnModuleInit {
    private readonly logger = new Logger(TransactionsGateway.name)

    @WebSocketServer()
    private readonly server: Server
    
    onModuleInit() {
        this.server.on("connection", (socket) => {
            this.logger.verbose(socket.id)
        })
    }
  
    @SubscribeMessage("events")
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
        return from([1, 2, 3]).pipe(map(item => ({ event: "events", data: item })))
    }
  
    @SubscribeMessage("identity")
    async identity(@MessageBody() data: number): Promise<number> {
        return data
    }
}