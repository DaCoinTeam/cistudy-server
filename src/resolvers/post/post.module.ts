import { Module } from "@nestjs/common"
import { PostResolvers } from "./post.resolvers"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    PostMySqlEntity,
    PostReactMySqlEntity,
    PostContentMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentContentMySqlEntity,
    PostCommentLikeMySqlEntity,
} from "@database"
import { PostsService } from "./post.service"

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
    providers: [PostResolvers, PostsService],
})
export class PostModule {}
