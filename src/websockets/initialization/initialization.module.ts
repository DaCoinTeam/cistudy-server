import { Module } from "@nestjs/common"
import { InitializationGateway } from "./initialization.gateway"

@Module({
    providers: [InitializationGateway],
})
export class InitializationModule {}