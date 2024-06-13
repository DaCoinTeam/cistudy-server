import { Module } from "@nestjs/common"
import { TransactionsGateway } from "./transactions.gateway"
import { AccountMySqlEntity } from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity
        ]),
    ],
    providers: [ TransactionsGateway ],
})
export class TransactionsModule {}
