import { Module } from "@nestjs/common"
import { PostsResolver } from "./posts.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    PostMySqlEntity,
    PostLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentReplyMySqlEntity,
    AccountMySqlEntity,
    RoleMySqlEntity
} from "@database"
import { PostsService } from "./posts.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity,
            PostMySqlEntity,
            PostLikeMySqlEntity,
            PostCommentMySqlEntity,
            PostCommentLikeMySqlEntity,
            PostCommentReplyMySqlEntity,
            RoleMySqlEntity
        ]),
    ],
    providers: [PostsResolver, PostsService],
})
export class PostsModule {}
