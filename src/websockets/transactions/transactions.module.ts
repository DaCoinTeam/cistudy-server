import { Module } from "@nestjs/common"
import { TransactionsGateway } from "./transactions.gateway"
import { TransactionsService } from "./transaction.service"

@Module({
    providers: [TransactionsService, TransactionsGateway],
})
export class TransactionsModule {}
