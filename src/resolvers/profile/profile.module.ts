import { Module } from "@nestjs/common"
import { ProfileResolver } from "./profile.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CourseMySqlEntity,
    FollowMySqlEnitity,
    UserMySqlEntity,
} from "@database"
import { ProfileService } from "./profile.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMySqlEntity,
            FollowMySqlEnitity,
            CourseMySqlEntity
        ]),
    ],
    providers: [ProfileResolver, ProfileService ],
})
export class ProfileModule {}
