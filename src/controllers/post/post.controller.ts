import {
    Controller,
    Post,
    Put,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger"
import PostService from "./post.service"
import { UserMySqlEntity } from "@database"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { JwtAuthGuard, AuthInterceptor, UserId, DataFromBody } from "../shared"
import { CreatePostData, UpdatePostData, createPostSchema, updatePostSchema } from "./shared"
import { Files } from "@common"

@ApiTags("Post")
@Controller("api/post")
export default class PostController {
    constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: createPostSchema })
  @Post("create-post")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    AuthInterceptor<UserMySqlEntity>,
    FileFieldsInterceptor([{ name: "files" }]),
  )
    async createPost(
    @UserId() userId: string,
    @DataFromBody() data: CreatePostData,
    @UploadedFiles() { files }: Files,
    ) {
        return await this.postService.createPost({ userId, data, files })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updatePostSchema })
    @Put("update-post")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
      AuthInterceptor<UserMySqlEntity>,
      FileFieldsInterceptor([{ name: "files" }]),
    )
  async updatePost(
      @UserId() userId: string,
      @DataFromBody() data: UpdatePostData,
      @UploadedFiles() { files }: Files,
  ) {
      return await this.postService.updatePost({ userId, data, files })
  }
}
