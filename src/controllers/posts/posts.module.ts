import { Module } from "@nestjs/common"
import { PostsController } from "./posts.controller"
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
    PostMediaMySqlEntity,
    PostCommentMediaMySqlEntity,
    PostCommentReplyMySqlEntity,
} from "@database"
import { PostsService } from "./posts.service"

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
            PostLikeMySqlEntity,
            PostCommentLikeMySqlEntity,
            PostMediaMySqlEntity,
            PostCommentMediaMySqlEntity,
            PostCommentReplyMySqlEntity
        ]),
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
