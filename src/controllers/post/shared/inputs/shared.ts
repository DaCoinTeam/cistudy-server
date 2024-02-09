import { ContentType } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class PostContentData {
  @ApiProperty()
      content: string

  @ApiProperty()
      contentType: ContentType

  @IsUUID("4")
  @ApiProperty({ nullable: true })
      postId?: string
}
