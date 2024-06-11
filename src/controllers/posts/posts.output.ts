import { Output } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional } from "class-validator";

export class CreatePostCommentReplyOutputOthers {
    @ApiProperty()
    postCommentReplyId: string
}

export class CreatePostCommentReplyOutput implements Output<CreatePostCommentReplyOutputOthers>{
    message: string;
    others: CreatePostCommentReplyOutputOthers
}

export class CreatePostCommentOutputOthers {
    @ApiProperty()
    postCommentId: string
    @ApiProperty()
    @IsOptional()
    earnAmount: number
}

export class CreatePostCommentOutput implements Output<CreatePostCommentOutputOthers>{
    message: string;
    others: CreatePostCommentOutputOthers
}

export class UpdatePostOutput implements Output{
    message: string;
}

export class ToggleCommentLikePostOutputOthers {
    @ApiProperty()
    postCommentLikeId: string
    @ApiProperty()
    @IsOptional()
    earnAmount: number
}


export class ToggleCommentLikePostOutputData implements Output<ToggleCommentLikePostOutputOthers>{
    message: string;
    others?: ToggleCommentLikePostOutputOthers;
}

export class ToggleLikePostOutputOthers {
    @ApiProperty()
    postLikeId: string
    @ApiProperty()
    @IsOptional()
    earnAmount: number
}

export class ToggleLikePostOutputData implements Output<ToggleLikePostOutputOthers>{
    message: string;
    @IsOptional()
    others: ToggleLikePostOutputOthers;
}


export class DeletePostOutput implements Output{
    message: string;
}

export class UpdatePostCommentOutput implements Output{
    message: string;
}

export class DeletePostCommentOutput implements Output{
    message: string;
}

export class UpdatePostCommentReplyOutput implements Output{
    message: string;
}

export class DeletePostCommentReplyOutput implements Output{
    message: string;
}