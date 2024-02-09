import { ContentType } from "@common"
import { ApiProperty } from "@nestjs/swagger"

export class PostContentData {
  @ApiProperty()
      content: string

  @ApiProperty()
      contentType: ContentType
}
