import { ContentType, AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsUUID } from "class-validator"

// CREATE POST
export class PostContentMediaData {
  @IsInt()
  @ApiProperty()
      mediaIndex: number
}
export class PostContentData {
  @ApiProperty({ nullable: true })
      text?: string
  @ApiProperty()
      contentType: ContentType
  @ApiProperty({ nullable: true })
      postContentMedias?: Array<PostContentMediaData>
}
export class CreatePostData {
    @ApiProperty()
        title: string
  
    @IsUUID("4")
    @ApiProperty()
        courseId: string
  
    @ApiProperty({ nullable: true })
        postContents?: Array<PostContentData>
}
export class CreatePostInput implements AuthInput<CreatePostData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: CreatePostData
    files: Array<Express.Multer.File>
}

// CREATE COMMENT
export class PostCommentContentMediaData {
    @IsInt()
    @ApiProperty()
        mediaIndex: number
}
export class PostCommentContentData {
    @ApiProperty({ nullable: true })
        text?: string
    @ApiProperty()
        contentType: ContentType
    @ApiProperty({ nullable: true })
        postCommentContentMedias?: Array<PostCommentContentMediaData>
}
export class CreateCommentData {
    @IsUUID("4")
    @ApiProperty()
        postId: string
  
    @ApiProperty({ nullable: true })
        postCommentContents?: Array<PostCommentContentData>
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
}

export class ReactPostInput implements AuthInput<ReactPostData> {
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
      postCommentContents?: Array<PostCommentContentData>
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
      postContents: Array<PostContentData>
}

export class UpdatePostInput implements AuthInput<UpdatePostData> {
  @IsUUID("4")
  @ApiProperty()
      userId: string
  data: UpdatePostData
  files: Array<Express.Multer.File>
}
