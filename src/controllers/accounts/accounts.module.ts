import {
    AccountJobMySqlEntity,
    AccountMySqlEntity,
    AccountQualificationMySqlEntity,
    AccountReviewMySqlEntity,
    CartMySqlEntity,
    CertificateMySqlEntity,
    ConfigurationMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    FollowMySqlEnitity,
    LessonMySqlEntity,
    NotificationMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostLikeMySqlEntity,
    PostMySqlEntity,
    QuizAttemptMySqlEntity,
    ReportAccountMySqlEntity,
    ReportCourseMySqlEntity,
    ReportPostCommentMySqlEntity,
    ReportPostMySqlEntity,
    ResourceMySqlEntity,
    RoleMySqlEntity,
    SectionMySqlEntity,
    SessionMySqlEntity,
} from "@database"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountsController } from "./accounts.controller"
import { AccountsService } from "./accounts.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SessionMySqlEntity,
            AccountMySqlEntity,
            AccountJobMySqlEntity,
            AccountQualificationMySqlEntity,
            PostMySqlEntity,
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LessonMySqlEntity,
            ResourceMySqlEntity,
            PostCommentMySqlEntity,
            PostLikeMySqlEntity,
            PostCommentLikeMySqlEntity,
            FollowMySqlEnitity,
            CartMySqlEntity,
            CertificateMySqlEntity,
            QuizAttemptMySqlEntity,
            AccountReviewMySqlEntity,
            RoleMySqlEntity,
            ReportAccountMySqlEntity,
            ReportCourseMySqlEntity,
            ReportPostMySqlEntity,
            ReportPostCommentMySqlEntity,
            NotificationMySqlEntity,
            ConfigurationMySqlEntity
        ]),
    ],
    controllers: [AccountsController],
    providers: [AccountsService],
})
export class AccountsModule {}
