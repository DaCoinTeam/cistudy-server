import { Module } from "@nestjs/common"
import { PostsController } from "./posts.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
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
    PostMediaMySqlEntity,
    PostCommentMediaMySqlEntity,
    PostCommentReplyMySqlEntity,
    RoleMySqlEntity,
    ReportPostMySqlEntity,
    ReportPostCommentMySqlEntity,
} from "@database"
import { PostsService } from "./posts.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SessionMySqlEntity,
            AccountMySqlEntity,
            RoleMySqlEntity,
            PostMySqlEntity,
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LessonMySqlEntity,
            ResourceMySqlEntity,
            PostCommentMySqlEntity,
            PostLikeMySqlEntity,
            PostCommentLikeMySqlEntity,
            PostMediaMySqlEntity,
            PostCommentMediaMySqlEntity,
            PostCommentReplyMySqlEntity,
            ReportPostMySqlEntity,
            ReportPostCommentMySqlEntity
        ]),
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
