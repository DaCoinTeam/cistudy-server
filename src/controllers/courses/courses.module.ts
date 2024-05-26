import { Module } from "@nestjs/common"
import { CoursesController } from "./courses.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    SessionMySqlEntity,
    UserMySqlEntity,
    PostMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    SectionMySqlEntity,
    LectureMySqlEntity,
    ResourceMySqlEntity,
    PostCommentMySqlEntity,
    PostLikeMySqlEntity,
    PostCommentLikeMySqlEntity,
    CourseTargetMySqlEntity,
    CourseSubcategoryMySqlEntity,
    CourseTopicMySqlEntity,
    TopicMySqlEntity,
    SubcategoyMySqlEntity,
    CategoryMySqlEntity,
    TransactionMongoEntity,
    TransactionMongoEntitySchema,
    CourseReviewMySqlEntity
} from "@database"
import { CoursesService } from "./courses.service"
import { MongooseModule } from "@nestjs/mongoose"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TransactionMongoEntity.name, schema: TransactionMongoEntitySchema }]),
        TypeOrmModule.forFeature([
            SessionMySqlEntity,
            UserMySqlEntity,
            PostMySqlEntity,
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LectureMySqlEntity,
            ResourceMySqlEntity,
            PostCommentMySqlEntity,
            PostLikeMySqlEntity,
            PostCommentLikeMySqlEntity,
            CourseTargetMySqlEntity,
            CourseSubcategoryMySqlEntity,
            CourseTopicMySqlEntity,
            TopicMySqlEntity,
            SubcategoyMySqlEntity,
            CategoryMySqlEntity,
            CourseReviewMySqlEntity
        ]),
    ],
    controllers: [CoursesController],
    providers: [CoursesService],
})
export class CoursesModule {}
