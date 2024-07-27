import { UseGuards, UseInterceptors } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { AccountId, AuthInterceptor, JwtAuthGuard } from "../shared"
import {
    FindManyPostCommentRepliesInputData,
    FindManyPostCommentReportsInputData,
    FindManyPostCommentsInputData,
    FindManyPostReportsInputData,
    FindManyPostsInputData,
    FindOnePostCommentInputData,
    FindOnePostInputData,
} from "./posts.input"
import {
    FindManyPostCommentRepliesOutput,
    FindManyPostCommentReportsOutput,
    FindManyPostCommentsOutput,
    FindManyPostReportsOutput,
    FindManyPostsOutput,
    FindOnePostCommentOutput,
    FindOnePostOutput,
} from "./posts.output"
import { PostsService } from "./posts.service"


@Resolver()
export class PostsResolver {
    constructor(private readonly postsService: PostsService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindOnePostOutput)
    async findOnePost(
    @AccountId() accountId: string,
    @Args("data") data: FindOnePostInputData,
    ) {
        return (await this.postsService.findOnePost({ accountId, data })).data
    }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyPostsOutput)
  async findManyPosts(
    @AccountId() accountId: string,
    @Args("data") data: FindManyPostsInputData,
  ) {
      return this.postsService.findManyPosts({ accountId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindOnePostCommentOutput)
  async findOnePostComment(
    @AccountId() accountId: string,
    @Args("data") data: FindOnePostCommentInputData,
  ) {
      return this.postsService.findOnePostComment({ accountId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyPostCommentsOutput)
  async findManyPostComments(
    @AccountId() accountId: string,
    @Args("data") data: FindManyPostCommentsInputData,
  ) {
      return this.postsService.findManyPostComments({ accountId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyPostCommentRepliesOutput)
  async findManyPostCommentReplies(
    @AccountId() accountId: string,
    @Args("data") data: FindManyPostCommentRepliesInputData,
  ) {
      return this.postsService.findManyPostCommentReplies({ accountId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyPostReportsOutput)
  async findManyPostReports(@Args("data") data: FindManyPostReportsInputData, @AccountId() accountId: string) {
      return await this.postsService.findManyPostReports({ accountId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyPostCommentReportsOutput)
  async findManyPostCommentReports(@Args("data") data: FindManyPostCommentReportsInputData, @AccountId() accountId: string) {
      return await this.postsService.findManyPostCommentReports({ accountId, data })
  }
}
