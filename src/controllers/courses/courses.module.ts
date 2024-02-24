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
    PostReactMySqlEntity,
    PostCommentLikeMySqlEntity,
    CourseTargetMySqlEntity,
} from "@database"
import { CoursesService } from "./courses.service"

@Module({
    imports: [
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
            PostReactMySqlEntity,
            PostCommentLikeMySqlEntity,
            CourseTargetMySqlEntity
        ]),
    ],
    controllers: [CoursesController],
    providers: [CoursesService],
})
export class CoursesModule {}
