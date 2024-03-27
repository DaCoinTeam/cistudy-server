import { Module } from "@nestjs/common"
import { BlockchainEvmModule } from "./blockchain-evm"

@Module({
    imports: [BlockchainEvmModule],
})
export class SchedulersModule { }
