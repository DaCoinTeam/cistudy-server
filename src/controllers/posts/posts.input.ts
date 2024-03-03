import { AuthInput, MediaType } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsUUID } from "class-validator"

// CREATE POST
export class PostMediaInputData {
    @IsInt()
    @ApiProperty()
        mediaIndex: number

    @ApiProperty()
        mediaType: MediaType
}

export class CreatePostInputData {
    @ApiProperty()
        title: string

    @IsUUID("4")
    @ApiProperty()
        courseId: string

    @ApiProperty()
        html: string

    @ApiProperty({ nullable: true })
        postMedias?: Array<PostMediaInputData>
}
export class CreatePostInput implements AuthInput<CreatePostInputData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: CreatePostInputData
    files: Array<Express.Multer.File>
}

// CREATE COMMENT
export class PostCommentMediaInputData {
    @IsInt()
    @ApiProperty()
        mediaIndex: number

    @ApiProperty()
        mediaType: MediaType
}

export class CreateCommentInputData {
    @IsUUID("4")
    @ApiProperty()
        postId: string

    @ApiProperty()
        html: string

    @ApiProperty({ nullable: true })
        postCommentMedias?: Array<PostCommentMediaInputData>
}
export class CreateCommentInput implements AuthInput<CreateCommentInputData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: CreateCommentInputData
    files: Array<Express.Multer.File>
}

export class ToggleLikePostInputData {
    @IsUUID()
    @ApiProperty()
        postId: string
}

export class ToggleLikePostInput implements AuthInput<ToggleLikePostInputData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: ToggleLikePostInputData

}

export class UpdateCommentInputData {
    @IsUUID("4")
    @ApiProperty()
        postCommentId: string

    @ApiProperty({ nullable: true })
        postCommentMedias?: Array<PostCommentMediaInputData>
}

export class UpdateCommentInput implements AuthInput<UpdateCommentInputData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: UpdateCommentInputData
    files: Array<Express.Multer.File>
}

export class UpdatePostInputData {
    @ApiProperty()
        title: string

    @IsUUID("4")
    @ApiProperty()
        postId: string

    @ApiProperty()
        postMedias: Array<PostMediaInputData>
}

export class UpdatePostInput implements AuthInput<UpdatePostInputData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: UpdatePostInputData
    files: Array<Express.Multer.File>
}
