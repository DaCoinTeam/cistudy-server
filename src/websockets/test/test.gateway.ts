import { Inject, Logger, UseGuards, UseInterceptors } from "@nestjs/common"

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
import { JwtAuthGuard } from "../shared"
import { AccountId } from "../shared"
import { AuthInterceptor } from "../shared"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { TEST_CALL, TEST_CALL2 } from "./test.events"
import { InjectRepository } from "@nestjs/typeorm"
import { AccountMySqlEntity } from "@database"
import { Repository } from "typeorm"
import { TestOutput } from "./test.output"
import { AccountEntity } from "src/database/mysql/account.entity"

@WebSocketGateway({
    cors: {
        origin: "*",
    },

})
export class TestGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(TestGateway.name)

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectRepository(AccountEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>
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
    @SubscribeMessage(TEST_CALL)
    async testCall(@MessageBody() body: string, @ConnectedSocket() client: Socket, @AccountId() accountId : string): Promise<TestOutput> {
        // this.server.emit(TEST_CALL, {
        //     msg : "new mess",
        //     content : body
        // })
        console.log(body)
        console.log(accountId)
        const userData = await this.accountMySqlRepository.findOne({ where: { username: body } })
        return {
            event: "testcall", data: {
                data: {
                    userData,
                    message:"User logged in : "+userData.username
                }
            }
        }
    }

    // @UseGuards(JwtAuthGuard)
    // //@UseInterceptors(AuthInterceptor)
    // @SubscribeMessage(TEST_CALL2)
    // async testCall2(@MessageBody() body: string, @ConnectedSocket() client: Socket): Promise<TestOutput> {
    //     // this.server.emit(TEST_CALL, {
    //     //     msg : "new mess",
    //     //     content : body
    //     // })
    //     console.log(body)
    //     const userData = await this.accountMySqlRepository.findOne({ where: { username: body } })
    //     return {
    //         event: "testcall", data: {
    //             data: {
    //                 userData
    //             }
    //         }
    //     }
    // }
}