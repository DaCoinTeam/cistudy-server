import { Module } from "@nestjs/common"
import { PostsResolver } from "./posts.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    PostMySqlEntity,
    PostLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentLikeMySqlEntity,
} from "@database"
import { PostsService } from "./posts.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PostMySqlEntity,
            PostLikeMySqlEntity,
            PostCommentMySqlEntity,
            PostCommentLikeMySqlEntity,
        ]),
    ],
    providers: [PostsResolver, PostsService],
})
export class PostsModule {}
