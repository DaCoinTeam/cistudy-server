import { Module } from "@nestjs/common"
import { BlockchainEvmService } from "./blockchain-evm.service"
import { MongooseModule } from "@nestjs/mongoose"
import { TransactionMongoEntity, TransactionMongoEntitySchema } from "@database"

@Module({
    imports: [MongooseModule.forFeature([{ name: TransactionMongoEntity.name, schema: TransactionMongoEntitySchema }])],
    providers: [BlockchainEvmService],
})
export class BlockchainEvmModule { }