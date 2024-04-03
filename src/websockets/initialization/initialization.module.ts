import { Module } from "@nestjs/common"
import { InitializationGateway } from "./initialization.gateway"
import { UserMySqlEntity } from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMySqlEntity
        ]),
    ],
    providers: [ InitializationGateway ],
})
export class InitializationModule {}