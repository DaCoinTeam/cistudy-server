import { Resolver, Query, Args } from "@nestjs/graphql"
import {
    FindManyPostCommentRepliesInputData,
    FindManyPostCommentsInputData,
    FindManyPostsInputData,
    FindOnePostCommentInputData,
    FindOnePostInputData,
} from "./posts.input"
import { PostsService } from "./posts.service"
import { AuthInterceptor, JwtAuthGuard, AccountId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import {
    FindManyPostCommentRepliesOutput,
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
}
