import { ContentType } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export interface IContentData {
  content: string;
  contentType: ContentType;
}

export class PostContentData implements IContentData {
  @ApiProperty()
      content: string

  @ApiProperty()
      contentType: ContentType

  @IsUUID("4")
  @ApiProperty({ nullable: true })
      postId?: string
}

export class PostCommentContentData implements IContentData {
  @ApiProperty()
      content: string

  @ApiProperty()
      contentType: ContentType

  @IsUUID("4")
  @ApiProperty({ nullable: true })
      postCommentId?: string
}
