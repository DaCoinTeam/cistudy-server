import { ContentType, AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export interface IContentData {
  content: string;
  contentType: ContentType;
}

export class PostContentData implements IContentData {
  @ApiProperty()
      content: string

  @ApiProperty()
      contentType: ContentType

  @IsUUID("4")
  @ApiProperty({ nullable: true })
      postId?: string
}

export class PostCommentContentData implements IContentData {
  @ApiProperty()
      content: string

  @ApiProperty()
      contentType: ContentType

  @IsUUID("4")
  @ApiProperty({ nullable: true })
      postCommentId?: string
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