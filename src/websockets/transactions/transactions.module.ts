import { Module } from "@nestjs/common"
import { TransactionsGateway } from "./transactions.gateway"
import { UserMySqlEntity } from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMySqlEntity
        ]),
    ],
    providers: [ TransactionsGateway ],
})
export class TransactionsModule {}
