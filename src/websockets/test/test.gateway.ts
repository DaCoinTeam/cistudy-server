import { Inject, Logger, UseGuards, UseInterceptors } from "@nestjs/common"

import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { JwtAuthGuard } from "../shared"
import { AccountId } from "../shared"
import { AuthInterceptor } from "../shared"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { REAL_TIME_CHAT, TEST_CALL, TEST_NO_AUTH } from "./test.events"
import { InjectRepository } from "@nestjs/typeorm"
import { AccountMySqlEntity } from "@database"
import { Repository } from "typeorm"
import { RealTimeChatOutput, TestNoAuth, TestOutput } from "./test.output"
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

    @SubscribeMessage(TEST_NO_AUTH)
    async testNoAuth(@MessageBody() body: string): Promise<TestNoAuth> {

        return {
            event: TEST_NO_AUTH,
            data: {
                data: {
                    message: "Some body asked: " + body + " server response : Chac chan la neo r"
                }
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @SubscribeMessage(TEST_CALL)
    async testCall(@MessageBody() body: string, @AccountId() accountId: string): Promise<TestOutput> {

        const userData = await this.accountMySqlRepository.findOne({ where: { accountId } })
        const time = new Date()

        const hours = time.getHours().toString().padStart(2, "0")
        const minutes = time.getMinutes().toString().padStart(2, "0")

        const formattedTime = `${hours}:${minutes}`
        return {
            event: "testcall", data: {
                data: {
                    userData,
                    message: "[" + formattedTime + "] " + userData.username + " says: " + body
                }
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @SubscribeMessage(REAL_TIME_CHAT)
    async realTimeChat(@MessageBody() body: string, @AccountId() accountId : string) : Promise<RealTimeChatOutput>{
        const userData = await this.accountMySqlRepository.findOne({ where: { accountId } })

        const time = new Date()
        const hours = time.getHours().toString().padStart(2, "0")
        const minutes = time.getMinutes().toString().padStart(2, "0")

        const formattedTime = `${hours}:${minutes}`
        this.server.emit(REAL_TIME_CHAT, "[" + formattedTime + "] " + userData.username + ": " + body)
        
        return{
            event: REAL_TIME_CHAT,
            data: {
                data:{
                    message:  userData.username + " sent a message"
                }
            }
        }
    }   
}