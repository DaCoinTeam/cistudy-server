import { Module } from "@nestjs/common"
import { InitializationModule } from "./initialization"
import { TransactionsModule } from "./transactions"
import { TestModule } from "./test"

@Module({
    imports: [ InitializationModule, TransactionsModule, TestModule ],
})
export class WebsocketsModule {}