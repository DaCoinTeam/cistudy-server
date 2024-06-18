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
    AccountMySqlEntity
} from "@database"
import { CoursesService } from "./courses.service"
import { MongooseModule } from "@nestjs/mongoose"
import { CategoryParentEntity } from "src/database/mysql/category-parent.entity"
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
            CategoryParentEntity,
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
            ProgressMySqlEntity,
        ]),
    ],
    controllers: [CoursesController],
    providers: [CoursesService],
})
export class CoursesModule {}
