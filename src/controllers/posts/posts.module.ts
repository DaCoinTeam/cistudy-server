import {
    AccountMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    LessonMySqlEntity,
    NotificationMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentMediaMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentReplyMySqlEntity,
    PostLikeMySqlEntity,
    PostMediaMySqlEntity,
    PostMySqlEntity,
    ReportPostCommentMySqlEntity,
    ReportPostMySqlEntity,
    ResourceMySqlEntity,
    RoleMySqlEntity,
    SectionMySqlEntity,
    SessionMySqlEntity,
    TransactionMySqlEntity,
} from "@database"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PostsController } from "./posts.controller"
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
            ReportPostCommentMySqlEntity,
            NotificationMySqlEntity,
            TransactionMySqlEntity
        ]),
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
