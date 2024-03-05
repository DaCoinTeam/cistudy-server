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
    CreateCommentInputData,
    CreatePostCommentReplyInputData,
    CreatePostInputData,
    ToggleLikePostCommentInputData,
    ToggleLikePostInputData,
    UpdateCommentInputData,
    UpdatePostInputData,
} from "./posts.input"

import {
    createCommentSchema,
    createPostSchema,
    updateCommentSchema,
    updatePostSchema,
} from "./posts.schema"

import { Files } from "@common"

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
  @Delete("delete-post")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async deletePost(@UserId() userId: string, @Param("postId") postId: string) {
      console.log(postId)
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
  @ApiBody({ schema: createCommentSchema })
  @Post("create-comment")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
  async createComment(
    @UserId() userId: string,
    @DataFromBody() data: CreateCommentInputData,
    @UploadedFiles() { files }: Files,
  ) {
      return await this.postsService.createComment({ userId, data, files })
  }

  @ApiBearerAuth()
  @Patch("toggle-like-post-comment")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async toggleLikePostComment(
    @UserId() userId: string,
    @Body() body: ToggleLikePostCommentInputData,
  ) {
      return this.postsService.toggleLikePostComment({
          userId,
          data: body,
      })
  }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: updateCommentSchema })
  @Put("update-comment")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
  async updateComment(
    @UserId() userId: string,
    @DataFromBody() data: UpdateCommentInputData,
    @UploadedFiles() { files }: Files,
  ) {
      return await this.postsService.updateComment({ userId, data, files })
  }

  @ApiBearerAuth()
  @Delete("delete-comment")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async deleteComment(
    @UserId() userId: string,
    @Param("commentId") postId: string,
  ) {
      console.log(postId)
  }

  @ApiBearerAuth()
  @Post("create-post-comment-reply")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async createPostCommentReply(
    @UserId() userId: string,
    @Body() body: CreatePostCommentReplyInputData,
  ) {
      return this.postsService.createPostCommentReply({
          userId,
          data: body,
      })
  }
}
