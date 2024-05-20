import { Module } from "@nestjs/common"
import { TestController } from "./test.controller"
import { TestService } from "./test.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TestMySqlEntity } from "@database"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TestMySqlEntity
        ])
    ],
    controllers: [TestController],
    providers: [TestService],
})
export class TestModule {}
