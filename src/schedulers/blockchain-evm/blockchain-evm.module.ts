import { Module } from "@nestjs/common"
import { BlockchainEvmService } from "./blockchain-evm.service"
import { MongooseModule } from "@nestjs/mongoose"
import {
    AccountMySqlEntity,
    TransactionMongoEntity,
    TransactionMongoEntitySchema,
} from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: TransactionMongoEntity.name,
                schema: TransactionMongoEntitySchema,
            },
        ]),
        TypeOrmModule.forFeature([AccountMySqlEntity]),
    ],
    providers: [BlockchainEvmService],
})
export class BlockchainEvmModule {}
