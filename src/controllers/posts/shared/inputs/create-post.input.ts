import { IAuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"
import { PostContentData } from "./shared"

export class CreatePostData {
  @ApiProperty()
      title: string

  @IsUUID("4")
  @ApiProperty()
      courseId: string

  @ApiProperty({ nullable: true })
      postContents?: Array<PostContentData>
}

export class CreatePostInput implements IAuthInput<CreatePostData> {
  @IsUUID("4")
  @ApiProperty()
      userId: string
  data: CreatePostData
  files: Array<Express.Multer.File>
}
