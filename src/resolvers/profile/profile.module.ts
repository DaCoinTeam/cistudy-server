import {
    AccountMySqlEntity,
    CertificateMySqlEntity,
    CourseMySqlEntity,
    CourseReviewMySqlEntity,
    EnrolledInfoMySqlEntity,
    FollowMySqlEnitity,
    NotificationMySqlEntity,
    OrderMySqlEntity,
    PostMySqlEntity,
    ReportAccountMySqlEntity,
    ReportCourseMySqlEntity,
    ReportPostCommentMySqlEntity,
    ReportPostMySqlEntity,
    TransactionMySqlEntity,
} from "@database"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProfileResolver } from "./profile.resolver"
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
            TransactionMySqlEntity,
            NotificationMySqlEntity,
            CertificateMySqlEntity,
            FollowMySqlEnitity,
            CourseReviewMySqlEntity,
            EnrolledInfoMySqlEntity,
            OrderMySqlEntity
        ]),
    ],
    providers: [ProfileResolver, ProfileService ],
})
export class ProfileModule {}
