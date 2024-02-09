import { IAuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"
import { PostCommentContentData } from "./shared"

export class CreateCommentData {
  @IsUUID("4")
  @ApiProperty()
      postId: string

  @ApiProperty({ nullable: true })
      postCommentContents?: Array<PostCommentContentData>
}

export class CreateCommentInput implements IAuthInput<CreateCommentData> {
  @IsUUID("4")
  @ApiProperty()
      userId: string
  data: CreateCommentData
  files: Array<Express.Multer.File>
}
