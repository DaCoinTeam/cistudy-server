import { Module } from "@nestjs/common"
import { InitializationModule } from "./initialization"

@Module({
    imports: [ InitializationModule ],
})
export class WebsocketsModule {}