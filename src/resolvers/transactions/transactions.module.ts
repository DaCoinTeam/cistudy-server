import { Module } from "@nestjs/common"
import {
    TransactionMongoEntity,
    TransactionMongoEntitySchema,
} from "@database"
import { MongooseModule } from "@nestjs/mongoose"
import { TransactionsResolver } from "./transactions.resolver"
import { TransactionsService } from "./transactions.service"

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: TransactionMongoEntity.name,
                schema: TransactionMongoEntitySchema,
            },
        ]),
    ],
    providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
