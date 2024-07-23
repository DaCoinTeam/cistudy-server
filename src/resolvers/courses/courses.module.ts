import { Module } from "@nestjs/common"
import {
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
    ProgressMySqlEntity,
    FollowMySqlEnitity,
} from "@database"
import { CoursesResolver } from "./courses.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CoursesService } from "./courses.service"
import { ResourceAttachmentEntity } from "src/database/mysql/resource-attachment.entity"

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
