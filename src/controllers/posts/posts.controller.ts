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
import { JwtAuthGuard, AuthInterceptor, AccountId, DataFromBody, Roles } from "../shared"
import {
    CreatePostCommentInputData,
    CreatePostCommentReplyInputData,
    CreatePostInputData,
    MarkPostCommentRewardedData,
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

import { Files, SystemRoles } from "@common"
import { CreatePostCommentReplyOutput, DeletePostCommentReplyOutput, UpdatePostCommentReplyOutput } from "./posts.output"
import { RolesGuard } from "../shared/guards/role.guard"

@ApiTags("Posts")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: createPostSchema })
    @Post("create-post")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
    async createPost(
        @AccountId() accountId: string,
        @DataFromBody() data: CreatePostInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return await this.postsService.createPost({ accountId, data, files })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updatePostSchema })
    @Put("update-post")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
    async updatePost(
        @AccountId() accountId: string,
        @DataFromBody() data: UpdatePostInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return await this.postsService.updatePost({ accountId, data, files })
    }

    @ApiBearerAuth()
    @Delete("delete-post/:postId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deletePost(@AccountId() accountId: string, @Param("postId") postId: string) {
        return await this.postsService.deletePost({
            accountId, data: {
                postId
            }
        })
    }

    @ApiBearerAuth()
    @Patch("toggle-like-post")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async toggleLikePost(
        @AccountId() accountId: string,
        @Body() body: ToggleLikePostInputData,
    ) {
        return this.postsService.toggleLikePost({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: createPostCommentSchema })
    @Post("create-post-comment")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
    async createPostComment(
        @AccountId() accountId: string,
        @DataFromBody() data: CreatePostCommentInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return await this.postsService.createPostComment({ accountId, data, files })
    }


    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updateCommentSchema })
    @Put("update-post-comment")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
    async updatePostComment(
        @AccountId() accountId: string,
        @DataFromBody() data: UpdatePostCommentInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return await this.postsService.updatePostComment({ accountId, data, files })
    }

    // @ApiBearerAuth()
    // @Delete("delete-post-comment/:postCommentId")
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(SystemRoles.User)
    // @UseInterceptors(AuthInterceptor)
    // async deletePostComment(
    //     @AccountId() accountId: string,
    //     @Param("postCommentId") postCommentId: string,
    // ) {
    //     return await this.postsService.deletePostComment({
    //         accountId, data: {
    //             postCommentId
    //         }
    //     })
    // }

    @ApiBearerAuth()
    @Patch("toggle-like-post-comment")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async toggleLikePostComment(
        @AccountId() accountId: string,
        @Body() body: ToggleLikePostCommentInputData,
    ) {
        return await this.postsService.toggleLikePostComment({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("create-post-comment-reply")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createPostCommentReply(
        @AccountId() accountId: string,
        @Body() body: CreatePostCommentReplyInputData,
    ): Promise<CreatePostCommentReplyOutput> {
        return await this.postsService.createPostCommentReply({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Put("update-post-comment-reply")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updatePostCommentReply(
        @AccountId() accountId: string,
        @Body() body: UpdatePostCommentReplyInputData,
    ): Promise<UpdatePostCommentReplyOutput> {
        return await this.postsService.updatePostCommentReply({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-post-comment-reply/:postCommentReply")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deletePostCommentReply(
        @AccountId() accountId: string,
        @Param("postCommentReply") postCommentReplyId: string,
    ): Promise<DeletePostCommentReplyOutput> {
        return await this.postsService.deletePostCommentReply({
            accountId,
            data: {
                postCommentReplyId
            },
        })
    }

    @ApiBearerAuth()
    @Patch("mark-post-comment-rewared")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async togglePostComment(
        @AccountId() accountId: string,
        @Body() body: MarkPostCommentRewardedData,
    ) {
        return this.postsService.markPostCommentRewarded({
            accountId,
            data: body,
        })
    }
}
