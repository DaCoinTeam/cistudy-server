import { Module } from "@nestjs/common"
import {
    TransactionMySqlEntity,
} from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionMySqlEntity]),
    ],
    providers: [],
})
export class TransactionModule {}
