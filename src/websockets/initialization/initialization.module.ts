import { Module } from "@nestjs/common"
import { InitializationGateway } from "./initialization.gateway"
import { InitializationService } from "./initialization.service"

@Module({
    providers: [InitializationService, InitializationGateway],
})
export class InitializationModule {}