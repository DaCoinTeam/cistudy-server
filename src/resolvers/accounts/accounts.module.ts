import { Module } from "@nestjs/common"
import { UsersResolver } from "./accounts.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CourseMySqlEntity,
    FollowMySqlEnitity,
    AccountMySqlEntity,
    UserReviewMySqlEntity,
} from "@database"
import { UsersService } from "./accounts.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity,
            FollowMySqlEnitity,
            CourseMySqlEntity,
            UserReviewMySqlEntity
        ]),
    ],
    providers: [UsersResolver, UsersService],
})
export class UsersModule {}
