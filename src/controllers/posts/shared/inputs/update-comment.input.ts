import { IAuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"
import { PostCommentContentData } from "./shared"

export class UpdateCommentData {
  @IsUUID("4")
  @ApiProperty()
      postCommentId: string

  @ApiProperty({ nullable: true })
      postCommentContents?: Array<PostCommentContentData>
}

export class UpdateCommentInput implements IAuthInput<UpdateCommentData> {
  @IsUUID("4")
  @ApiProperty()
      userId: string
  data: UpdateCommentData
  files: Array<Express.Multer.File>
}
