import { Module } from "@nestjs/common"
import { InitializationGateway } from "./initialization.gateway"
import {
    AccountMySqlEntity,
    NotificationMySqlEntity,
    SessionMySqlEntity,
} from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity,
            SessionMySqlEntity,
            NotificationMySqlEntity,
        ]),
    ],
    providers: [InitializationGateway],
})
export class InitializationModule {}
