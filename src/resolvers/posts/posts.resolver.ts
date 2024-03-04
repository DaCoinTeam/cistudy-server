import { Resolver, Query, Args } from "@nestjs/graphql"
import {
    FindManyPostCommentsInputData,
    FindManyPostsInputData,
    FindOnePostCommentInputData,
    FindOnePostInputData,
} from "./posts.input"
import { PostsService } from "./posts.service"
import { AuthInterceptor, JwtAuthGuard, UserId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import {
    FindManyPostCommentsOutput,
    FindManyPostsOutput,
    FindOnePostCommentOutput,
    FindOnePostOutput,
} from "./posts.output"

@Resolver()
export class PostsResolver {
    constructor(private readonly postsService: PostsService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindOnePostOutput)
    async findOnePost(
    @UserId() userId: string,
    @Args("data") data: FindOnePostInputData,
    ) {
        return this.postsService.findOnePost({ userId, data })
    }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyPostsOutput)
  async findManyPosts(
    @UserId() userId: string,
    @Args("data") data: FindManyPostsInputData,
  ) {
      return this.postsService.findManyPosts({ userId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindOnePostCommentOutput)
  async findOnePostComment(
    @UserId() userId: string,
    @Args("data") data: FindOnePostCommentInputData,
  ) {
      return this.postsService.findOnePostComment({ userId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyPostCommentsOutput)
  async findManyPostComments(
    @UserId() userId: string,
    @Args("data") data: FindManyPostCommentsInputData,
  ) {
      return this.postsService.findManyPostComments({ userId, data })
  }
}
