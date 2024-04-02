import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import { WsResponse } from "@nestjs/websockets"
import { INITIALIZED } from "./initialization.events"
import { Cache } from "cache-manager"
import { InitializeInput } from "./initialization.input"
import { InitializeOutputData } from "./initialization.output"
import { Socket } from "socket.io"

@Injectable()
export class InitializationService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async handleDisconnect(client: Socket) {
        await this.cacheManager.del(client.id)
    }

    async initialize(input: InitializeInput) : Promise<WsResponse<InitializeOutputData>> {
        const { client, userId } = input
        await this.cacheManager.set(client.id, userId)
        return { event: INITIALIZED, data: {} }
    }
}