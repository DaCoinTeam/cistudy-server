import { AuthInput, MediaType } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsInt, IsUUID } from "class-validator"

// CREATE POST
export class PostMediaData {
    @IsInt()
    @ApiProperty()
        mediaIndex: number

    @ApiProperty()
        mediaType: MediaType
}

export class CreatePostData {
    @ApiProperty()
        title: string

    @IsUUID("4")
    @ApiProperty()
        courseId: string

    @ApiProperty()
        html: string

    @ApiProperty({ nullable: true })
        postMedias?: Array<PostMediaData>
}
export class CreatePostInput implements AuthInput<CreatePostData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: CreatePostData
    files: Array<Express.Multer.File>
}

// CREATE COMMENT
export class PostCommentMediaData {
    @IsInt()
    @ApiProperty()
        mediaIndex: number

    @ApiProperty()
        mediaType: MediaType
}

export class CreateCommentData {
    @IsUUID("4")
    @ApiProperty()
        postId: string

    @ApiProperty()
        html: string

    @ApiProperty({ nullable: true })
        postCommentMedias?: Array<PostCommentMediaData>
}
export class CreateCommentInput implements AuthInput<CreateCommentData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: CreateCommentData
    files: Array<Express.Multer.File>
}

export class ReactPostData {
    @IsUUID()
    @ApiProperty()
        postId: string
    @IsBoolean()
    @ApiProperty()
        liked: boolean
}

export class UpsertReactPostInput implements AuthInput<ReactPostData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: ReactPostData

}

export class UpdateCommentData {
    @IsUUID("4")
    @ApiProperty()
        postCommentId: string

    @ApiProperty({ nullable: true })
        postCommentMedias?: Array<PostCommentMediaData>
}

export class UpdateCommentInput implements AuthInput<UpdateCommentData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: UpdateCommentData
    files: Array<Express.Multer.File>
}

export class UpdatePostData {
    @ApiProperty()
        title: string

    @IsUUID("4")
    @ApiProperty()
        postId: string

    @ApiProperty()
        postMedias: Array<PostMediaData>
}

export class UpdatePostInput implements AuthInput<UpdatePostData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: UpdatePostData
    files: Array<Express.Multer.File>
}
