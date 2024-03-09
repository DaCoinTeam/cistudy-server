import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    Put,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiHeader,
    ApiTags,
} from "@nestjs/swagger"
import { PostsService } from "./posts.service"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { JwtAuthGuard, AuthInterceptor, UserId, DataFromBody } from "../shared"
import {
    CreatePostCommentInputData,
    CreatePostCommentReplyInputData,
    CreatePostInputData,
    ToggleLikePostCommentInputData,
    ToggleLikePostInputData,
    UpdatePostCommentInputData,
    UpdatePostCommentReplyInputData,
    UpdatePostInputData,
} from "./posts.input"

import {
    createPostCommentSchema,
    createPostSchema,
    updateCommentSchema,
    updatePostSchema,
} from "./posts.schema"

import { Files } from "@common"
import {
    CreatePostCommentReplyOutput,
    DeletePostCommentReplyOutput,
    UpdatePostCommentReplyOutput,
} from "./posts.output"

@ApiTags("Posts")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: createPostSchema })
  @Post("create-post")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
    async createPost(
    @UserId() userId: string,
    @DataFromBody() data: CreatePostInputData,
    @UploadedFiles() { files }: Files,
    ) {
        return await this.postsService.createPost({ userId, data, files })
    }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: updatePostSchema })
  @Put("update-post")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
  async updatePost(
    @UserId() userId: string,
    @DataFromBody() data: UpdatePostInputData,
    @UploadedFiles() { files }: Files,
  ) {
      return await this.postsService.updatePost({ userId, data, files })
  }

  @ApiBearerAuth()
  @Delete("delete-post/:postId")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async deletePost(@UserId() userId: string, @Param("postId") postId: string) {
      return await this.postsService.deletePost({
          userId,
          data: {
              postId,
          },
      })
  }

  @ApiBearerAuth()
  @Patch("toggle-like-post")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async toggleLikePost(
    @UserId() userId: string,
    @Body() body: ToggleLikePostInputData,
  ) {
      return this.postsService.toggleLikePost({
          userId,
          data: body,
      })
  }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: createPostCommentSchema })
  @Post("create-post-comment")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
  async createPostComment(
    @UserId() userId: string,
    @DataFromBody() data: CreatePostCommentInputData,
    @UploadedFiles() { files }: Files,
  ) {
      return await this.postsService.createPostComment({ userId, data, files })
  }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: updateCommentSchema })
  @Put("update-post-comment")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
  async updatePostComment(
    @UserId() userId: string,
    @DataFromBody() data: UpdatePostCommentInputData,
    @UploadedFiles() { files }: Files,
  ) {
      return await this.postsService.updatePostComment({ userId, data, files })
  }

  @ApiBearerAuth()
  @Delete("delete-post-comment/:postCommentId")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async deletePostComment(
    @UserId() userId: string,
    @Param("postCommentId") postCommentId: string,
  ) {
      return await this.postsService.deletePostComment({
          userId,
          data: {
              postCommentId,
          },
      })
  }

  @ApiBearerAuth()
  @Patch("toggle-like-post-comment")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async toggleLikePostComment(
    @UserId() userId: string,
    @Body() body: ToggleLikePostCommentInputData,
  ) {
      return await this.postsService.toggleLikePostComment({
          userId,
          data: body,
      })
  }

  @ApiBearerAuth()
  @Post("create-post-comment-reply")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async createPostCommentReply(
    @UserId() userId: string,
    @Body() body: CreatePostCommentReplyInputData,
  ): Promise<CreatePostCommentReplyOutput> {
      return await this.postsService.createPostCommentReply({
          userId,
          data: body,
      })
  }

  @ApiBearerAuth()
  @Put("update-post-comment-reply")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async updatePostCommentReply(
    @UserId() userId: string,
    @Body() body: UpdatePostCommentReplyInputData,
  ): Promise<UpdatePostCommentReplyOutput> {
      return await this.postsService.updatePostCommentReply({
          userId,
          data: body,
      })
  }

  @ApiBearerAuth()
  @Delete("delete-post-comment-reply/:postCommentReply")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async deletePostCommentReply(
    @UserId() userId: string,
    @Param("postCommentReply") postCommentReplyId: string,
  ): Promise<DeletePostCommentReplyOutput> {
      return await this.postsService.deletePostCommentReply({
          userId,
          data: {
              postCommentReplyId,
          },
      })
  }
}
