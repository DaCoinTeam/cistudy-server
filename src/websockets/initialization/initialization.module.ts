import { Module } from "@nestjs/common"
import { InitializationGateway } from "./initialization.gateway"
import { AccountMySqlEntity } from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity
        ]),
    ],
    providers: [ InitializationGateway ],
})
export class InitializationModule {}