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
      accountId: string
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

export class CreatePostCommentInputData {
  @IsUUID("4")
  @ApiProperty()
      postId: string

  @ApiProperty()
      html: string

  @ApiProperty({ nullable: true })
      postCommentMedias?: Array<PostCommentMediaInputData>
}
export class CreatePostCommentInput
implements AuthInput<CreatePostCommentInputData>
{
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: CreatePostCommentInputData
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
      accountId: string
  data: ToggleLikePostInputData
}

export class ToggleLikePostCommentInputData {
  @IsUUID()
  @ApiProperty()
      postCommentId: string
}

export class ToggleLikePostCommentInput
implements AuthInput<ToggleLikePostCommentInputData>
{
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: ToggleLikePostCommentInputData
}

export class UpdatePostCommentInputData {
  @IsUUID("4")
  @ApiProperty()
      postCommentId: string
  @ApiProperty()
      html: string
  @ApiProperty({ nullable: true })
      postCommentMedias?: Array<PostCommentMediaInputData>
}

export class DeletePostCommentInputData {
  @IsUUID("4")
  @ApiProperty()
      postCommentId: string
}

export class DeletePostCommentInput
implements AuthInput<DeletePostCommentInputData>
{
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: DeletePostCommentInputData
}

export class UpdatePostCommentInput
implements AuthInput<UpdatePostCommentInputData>
{
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: UpdatePostCommentInputData
  files: Array<Express.Multer.File>
}

export class UpdatePostInputData {
  @IsUUID("4")
  @ApiProperty()
      postId: string

  @ApiProperty()
      title: string

  @ApiProperty()
      html: string

  @ApiProperty()
      postMedias: Array<PostMediaInputData>
}

export class UpdatePostInput implements AuthInput<UpdatePostInputData> {
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: UpdatePostInputData
  files: Array<Express.Multer.File>
}

export class DeletePostInputData {
    @IsUUID("4")
    @ApiProperty()
        postId: string
}
  
export class DeletePostInput
implements AuthInput<DeletePostInputData>
{
    @IsUUID("4")
    @ApiProperty()
        accountId: string
    data: DeletePostInputData
}
  
export class CreatePostCommentReplyInputData {
  @IsUUID("4")
  @ApiProperty()
      postCommentId: string

  @ApiProperty()
      content: string
}

export class CreatePostCommentReplyInput
implements AuthInput<CreatePostCommentReplyInputData>
{
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: CreatePostCommentReplyInputData
}

export class UpdatePostCommentReplyInputData {
  @IsUUID("4")
  @ApiProperty()
      postCommentReplyId: string

  @ApiProperty()
      content: string
}

export class UpdatePostCommentReplyInput
implements AuthInput<UpdatePostCommentReplyInputData>
{
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: UpdatePostCommentReplyInputData
}

export class DeletePostCommentReplyInputData {
  @IsUUID("4")
  @ApiProperty()
      postCommentReplyId: string
}

export class DeletePostCommentReplyInput
implements AuthInput<DeletePostCommentReplyInputData>
{
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: DeletePostCommentReplyInputData
}

export class TogglePostCommentInputData {
    @ApiProperty()
    postId: string
}

export class TogglePostCommentInput implements AuthInput<TogglePostCommentInputData>{
    @IsUUID("4")
    accountId: string
    data: TogglePostCommentInputData
}
