import {
    AccountMySqlEntity,
    CategoryMySqlEntity,
    CourseCategoryMySqlEntity,
    CourseMySqlEntity,
    CourseReviewMySqlEntity,
    CourseTargetMySqlEntity,
    CryptoWalletMySqlEntity,
    EnrolledInfoMySqlEntity,
    FollowMySqlEnitity,
    LessonMySqlEntity,
    ProgressMySqlEntity,
    QuizAttemptMySqlEntity,
    QuizMySqlEntity,
    QuizQuestionMySqlEntity,
    ReportCourseMySqlEntity,
    ResourceMySqlEntity,
    RoleMySqlEntity,
    SectionContentMySqlEntity,
    SectionMySqlEntity,
    SessionMySqlEntity,
} from "@database"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ResourceAttachmentEntity } from "src/database/mysql/resource-attachment.entity"
import { CoursesResolver } from "./courses.resolver"
import { CoursesService } from "./courses.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LessonMySqlEntity,
            ResourceMySqlEntity,
            AccountMySqlEntity,
            SessionMySqlEntity,
            CourseTargetMySqlEntity,
            CryptoWalletMySqlEntity,
            CategoryMySqlEntity,
            CourseReviewMySqlEntity,
            QuizAttemptMySqlEntity,
            QuizMySqlEntity,
            QuizQuestionMySqlEntity,
            RoleMySqlEntity,
            ReportCourseMySqlEntity,
            CourseCategoryMySqlEntity,
            SectionContentMySqlEntity,
            ResourceAttachmentEntity,
            ProgressMySqlEntity,
            FollowMySqlEnitity
        ]),
    ],
    providers: [CoursesResolver, CoursesService],
})
export class CoursesModule {}
