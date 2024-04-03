import { Module } from "@nestjs/common"
import { PostsResolver } from "./posts.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    PostMySqlEntity,
    PostLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentReplyMySqlEntity,
    UserMySqlEntity
} from "@database"
import { PostsService } from "./posts.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMySqlEntity,
            PostMySqlEntity,
            PostLikeMySqlEntity,
            PostCommentMySqlEntity,
            PostCommentLikeMySqlEntity,
            PostCommentReplyMySqlEntity
        ]),
    ],
    providers: [PostsResolver, PostsService],
})
export class PostsModule {}
