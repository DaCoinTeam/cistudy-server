import { IAuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"
import { PostContentData } from "./shared"

export class UpdatePostData {
  @ApiProperty()
      title: string

  @IsUUID("4")
  @ApiProperty()
      postId: string

  @ApiProperty()
      postContents: Array<PostContentData>
}

export class UpdatePostInput implements IAuthInput<UpdatePostData> {
  @IsUUID("4")
  @ApiProperty()
      userId: string
  data: UpdatePostData
  files: Array<Express.Multer.File>
}