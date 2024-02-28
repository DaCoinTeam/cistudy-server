import { Module } from "@nestjs/common"
import { UsersResolver } from "./users.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CourseMySqlEntity,
    FollowMySqlEnitity,
    UserMySqlEntity,
} from "@database"
import { UsersService } from "./users.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMySqlEntity,
            FollowMySqlEnitity,
            CourseMySqlEntity
        ]),
    ],
    providers: [UsersResolver, UsersService],
})
export class UsersModule {}
