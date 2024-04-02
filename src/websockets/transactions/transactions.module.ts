import { Module } from "@nestjs/common"
import { TransactionsGateway } from "./transactions.gateway"

@Module({
    providers: [ TransactionsGateway ],
})
export class TransactionsModule {}
