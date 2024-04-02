import { Module } from "@nestjs/common"
import { InitializationModule } from "./initialization"
import { TransactionsModule } from "./transactions"

@Module({
    imports: [ InitializationModule, TransactionsModule ],
})
export class WebsocketsModule {}