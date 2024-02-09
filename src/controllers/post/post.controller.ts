import {
    Controller,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger"
import PostService from "./post.service"
import { UserMySqlEntity } from "@database"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { JwtAuthGuard, AuthInterceptor, UserId, DataFromBody } from "../shared"
import { CreatePostData, createPostSchema } from "./shared"
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
}
