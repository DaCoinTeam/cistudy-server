import { Module } from "@nestjs/common"
import { ProfileResolver } from "./profile.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CourseMySqlEntity,
    FollowMySqlEnitity,
    AccountMySqlEntity,
    PostMySqlEntity,
    ReportAccountMySqlEntity,
    ReportCourseMySqlEntity,
    ReportPostMySqlEntity,
    ReportPostCommentMySqlEntity,
    TransactionMySqlEntity,
} from "@database"
import { ProfileService } from "./profile.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity,
            FollowMySqlEnitity,
            CourseMySqlEntity,
            PostMySqlEntity,
            ReportAccountMySqlEntity,
            ReportCourseMySqlEntity,
            ReportPostMySqlEntity,
            ReportPostCommentMySqlEntity,
            TransactionMySqlEntity
        ]),
    ],
    providers: [ProfileResolver, ProfileService ],
})
export class ProfileModule {}
