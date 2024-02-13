import { Module } from "@nestjs/common"
import { UsersResolver } from "./users.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    UserMySqlEntity,
} from "@database"
import { UsersService } from "./users.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMySqlEntity
        ]),
    ],
    providers: [UsersResolver, UsersService],
})
export class UsersModule {}
