import { Resolver, Query, Args } from "@nestjs/graphql"
import {
    FindManyPostCommentsData,
    FindManyPostsData,
    FindOnePostCommentData,
    FindOnePostData,
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
    constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindOnePostOutput)
    async findOnePost(
    @UserId() userId: string,
    @Args("data") data: FindOnePostData,
    ) {
        return this.postsService.findOnePost({ userId, data })
    }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyPostsOutput)
  async findManyPosts(
    @UserId() userId: string,
    @Args("data") data: FindManyPostsData,
  ) {
      return this.postsService.findManyPosts({ userId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindOnePostCommentOutput)
  async findOnePostComment(
    @UserId() userId: string,
    @Args("data") data: FindOnePostCommentData,
  ) {
      return this.postsService.findOnePostComment({ userId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyPostCommentsOutput)
  async findManyPostComments(
    @UserId() userId: string,
    @Args("data") data: FindManyPostCommentsData,
  ) {
      return this.postsService.findManyPostComments({ userId, data })
  }
}
