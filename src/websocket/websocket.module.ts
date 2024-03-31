import { Module } from "@nestjs/common"
import { InitializationGateway, TransactionsGateway } from "./gateways"

@Module({
    providers: [InitializationGateway, TransactionsGateway],
})
export class WebsocketModule {}