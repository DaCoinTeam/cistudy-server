import { AuthInput, MediaType, ReportProcessStatus } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsUUID, MinLength } from "class-validator"

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

export class MarkPostCommentAsSolutionInputData {
    @ApiProperty()
        postCommentId: string
}

export class MarkPostCommentAsSolutionInput implements AuthInput<MarkPostCommentAsSolutionInputData>{
    @IsUUID("4")
        accountId: string
    data: MarkPostCommentAsSolutionInputData
}

export class CreatePostReportInputData {
    @ApiProperty()
        reportedPostId: string
    @ApiProperty()
    @MinLength(20)
        title: string
    @ApiProperty()
    @MinLength(20)
        description: string
}

export class CreatePostReportInput implements AuthInput<CreatePostReportInputData>{
    accountId: string
    data: CreatePostReportInputData
}

export class UpdatePostReportInputData {
    @IsUUID("4")
    @ApiProperty()
        reportPostId : string
    @ApiProperty()
    @MinLength(20)
        title: string
    @ApiProperty()
    @MinLength(20)
        description: string
}

export class UpdatePostReportInput implements AuthInput<UpdatePostReportInputData> {
    accountId: string
    data: UpdatePostReportInputData
}

export class CreatePostCommentReportInputData {
    @ApiProperty()
        reportedPostCommentId: string
    @ApiProperty()
    @MinLength(20)
        title: string
    @ApiProperty()
    @MinLength(20)
        description: string
}

export class CreatePostCommentReportInput implements AuthInput<CreatePostCommentReportInputData>{
    accountId: string
    data: CreatePostCommentReportInputData
}

export class UpdatePostCommentReportInputData {
    @IsUUID("4")
    @ApiProperty()
        reportPostCommentId : string
    @ApiProperty()
    @MinLength(20)
        title: string
    @ApiProperty()
    @MinLength(20)
        description: string
}

export class UpdatePostCommentReportInput implements AuthInput<UpdatePostCommentReportInputData> {
    accountId: string
    data: UpdatePostCommentReportInputData
}

export class ResolvePostReportInputData {
    @ApiProperty()
    @IsUUID("4")
        reportPostId : string
    @ApiProperty()
        processStatus : ReportProcessStatus
    @ApiProperty()
    @MinLength(20)
        processNote : string
}

export class ResolvePostReportInput implements AuthInput<ResolvePostReportInputData> {
    accountId: string
    data: ResolvePostReportInputData
}

export class ResolvePostCommentReportInputData {
    @ApiProperty()
    @IsUUID("4")
        reportPostCommentId : string
    @ApiProperty()
        processStatus : ReportProcessStatus
    @ApiProperty()
    @MinLength(20)
        processNote : string
}

export class ResolvePostCommentReportInput implements AuthInput<ResolvePostCommentReportInputData> {
    accountId: string
    data: ResolvePostCommentReportInputData
}