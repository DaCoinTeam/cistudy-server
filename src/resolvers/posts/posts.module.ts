import { Module } from "@nestjs/common"
import { PostsResolver } from "./posts.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    PostMySqlEntity,
    PostReactMySqlEntity,
    PostContentMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentContentMySqlEntity,
    PostCommentLikeMySqlEntity,
} from "@database"
import { PostsService } from "./posts.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PostMySqlEntity,
            PostReactMySqlEntity,
            PostContentMySqlEntity,
            PostCommentMySqlEntity,
            PostCommentContentMySqlEntity,
            PostCommentLikeMySqlEntity,
        ]),
    ],
    providers: [PostsResolver, PostsService],
})
export class PostsModule {}
