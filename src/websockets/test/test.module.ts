import { Module } from "@nestjs/common"
import { TestGateway } from "./test.gateway"
import { AccountMySqlEntity } from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity
        ]),
    ],
    providers: [ TestGateway ],
})
export class TestModule {}