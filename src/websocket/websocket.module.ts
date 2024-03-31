import { Module } from "@nestjs/common"
import { TransactionsGateway } from "./gateways"

@Module({
    providers: [TransactionsGateway],
})
export class WebsocketModule {}