import { Module } from "@nestjs/common"
import { BlockchainEvmService } from "./blockchain-evm.service"
import { MongooseModule } from "@nestjs/mongoose"
import { TransactionMongo, TransactionMongoSchema } from "@database"

@Module({
    imports: [MongooseModule.forFeature([{ name: TransactionMongo.name, schema: TransactionMongoSchema }])],
    providers: [BlockchainEvmService],
})
export class BlockchainEvmModule {}