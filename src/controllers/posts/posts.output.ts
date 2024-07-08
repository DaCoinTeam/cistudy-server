import { Output } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsUUID } from "class-validator"

export class CreatePostCommentReplyOutputOthers {
    @ApiProperty()
        postCommentReplyId: string
}

export class CreatePostCommentReplyOutput implements Output<CreatePostCommentReplyOutputOthers>{
    message: string
    others: CreatePostCommentReplyOutputOthers
}

export class CreatePostCommentOutputOthers {
    @ApiProperty()
        postCommentId: string
    @ApiProperty()
    @IsOptional()
        earnAmount?: number
    isOwner?: boolean
    alreadyRewarded?: boolean
}

export class CreatePostCommentOutput implements Output<CreatePostCommentOutputOthers>{
    message: string
    others: CreatePostCommentOutputOthers
}

export class UpdatePostOutput implements Output{
    message: string
}

export class ToggleCommentLikePostOutputOthers {
    @ApiProperty()
        postCommentLikeId: string
    @ApiProperty()
    @IsOptional()
        earnAmount: number
}


export class ToggleCommentLikePostOutputData implements Output<ToggleCommentLikePostOutputOthers>{
    message: string
    others?: ToggleCommentLikePostOutputOthers
}

export class ToggleLikePostOutputOthers {
    @ApiProperty()
        postLikeId: string
    @ApiProperty()
    @IsOptional()
        earnAmount?: number
}

export class ToggleLikePostOutputData implements Output<ToggleLikePostOutputOthers>{
    message: string
    @IsOptional()
        others?: ToggleLikePostOutputOthers
}


export class DeletePostOutput implements Output{
    message: string
}

export class UpdatePostCommentOutput implements Output{
    message: string
}

export class DeletePostCommentOutput implements Output{
    message: string
}

export class UpdatePostCommentReplyOutput implements Output{
    message: string
    // others?: undefined;
}

export class DeletePostCommentReplyOutput implements Output{
    message: string
}

export class CreatePostOutputOthers{
    postId? : string
    earnAmount? : number
}

export class CreatePostOutput implements Output<CreatePostOutputOthers>{
    message: string
    others?: CreatePostOutputOthers
}

export class MarkPostCommentAsSolutionOutput implements Output{
    message: string
}

export class CreatePostReportOutputOthers{
    @IsUUID("4")
        reportPostId : string
}

export class CreatePostReportOutput implements Output<CreatePostReportOutputOthers> {
    message: string
    others?: CreatePostReportOutputOthers
}

export class UpdatePostReportOutputOthers{
    @IsUUID("4")
        reportPostId : string
}

export class UpdatePostReportOutput implements Output<UpdatePostReportOutputOthers> {
    message: string
    others?: UpdatePostReportOutputOthers
}

export class CreatePostCommentReportOutputOthers{
    @IsUUID("4")
        reportPostCommentId : string
}

export class CreatePostCommentReportOutput implements Output<CreatePostCommentReportOutputOthers> {
    message: string
    others?: CreatePostCommentReportOutputOthers
}

export class UpdatePostCommentReportOutputOthers{
    @IsUUID("4")
        reportPostCommentId : string
}

export class UpdatePostCommentReportOutput implements Output<UpdatePostCommentReportOutputOthers> {
    message: string
    others?: UpdatePostCommentReportOutputOthers
}
