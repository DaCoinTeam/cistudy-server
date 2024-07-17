import { Module } from "@nestjs/common"
import { CoursesController } from "./courses.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    SessionMySqlEntity,
    PostMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    SectionMySqlEntity,
    LessonMySqlEntity,
    ResourceMySqlEntity,
    PostCommentMySqlEntity,
    PostLikeMySqlEntity,
    PostCommentLikeMySqlEntity,
    CourseTargetMySqlEntity,
    CategoryMySqlEntity,
    TransactionMongoEntity,
    TransactionMongoEntitySchema,
    CourseReviewMySqlEntity,
    CartMySqlEntity,
    CartCourseMySqlEntity,
    CertificateMySqlEntity,
    QuizMySqlEntity,
    QuizQuestionMediaMySqlEntity,
    QuizQuestionMySqlEntity,
    QuizQuestionAnswerMySqlEntity,
    ProgressMySqlEntity,
    QuizAttemptMySqlEntity,
    AccountMySqlEntity,
    RoleMySqlEntity,
    ReportCourseMySqlEntity,
    CourseCategoryMySqlEntity,
    QuizAttemptAnswerMySqlEntity
} from "@database"
import { CoursesService } from "./courses.service"
import { MongooseModule } from "@nestjs/mongoose"
import { CategoryRelationEntity } from "src/database/mysql/category-relation.entity"
import { CourseCategoryEntity } from "src/database/mysql/course-category.entity"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TransactionMongoEntity.name, schema: TransactionMongoEntitySchema }]),
        TypeOrmModule.forFeature([
            SessionMySqlEntity,
            AccountMySqlEntity,
            PostMySqlEntity,
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LessonMySqlEntity,
            ResourceMySqlEntity,
            PostCommentMySqlEntity,
            PostLikeMySqlEntity,
            PostCommentLikeMySqlEntity,
            CourseTargetMySqlEntity,
            CategoryRelationEntity,
            CourseCategoryEntity,
            CategoryMySqlEntity,
            CourseReviewMySqlEntity,
            CartMySqlEntity,
            CartCourseMySqlEntity,
            CertificateMySqlEntity,
            QuizMySqlEntity,
            QuizQuestionMediaMySqlEntity,
            QuizQuestionMySqlEntity,
            QuizQuestionAnswerMySqlEntity,
            QuizQuestionMediaMySqlEntity,
            QuizAttemptMySqlEntity,
            QuizAttemptAnswerMySqlEntity,
            ProgressMySqlEntity,
            RoleMySqlEntity,
            ReportCourseMySqlEntity,
            CourseCategoryMySqlEntity
        ]),
    ],
    controllers: [CoursesController],
    providers: [CoursesService],
})
export class CoursesModule {}
