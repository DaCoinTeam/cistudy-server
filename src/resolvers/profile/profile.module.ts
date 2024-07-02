import { Module } from "@nestjs/common"
import { ProfileResolver } from "./profile.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CourseMySqlEntity,
    FollowMySqlEnitity,
    AccountMySqlEntity,
    PostMySqlEntity,
} from "@database"
import { ProfileService } from "./profile.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity,
            FollowMySqlEnitity,
            CourseMySqlEntity,
            PostMySqlEntity
        ]),
    ],
    providers: [ProfileResolver, ProfileService ],
})
export class ProfileModule {}
