import { Module } from "@nestjs/common"
import { InitializationModule } from "./initialization"
import { TestModule } from "./test"

@Module({
    imports: [ InitializationModule, TestModule ],
})
export class WebsocketsModule {}