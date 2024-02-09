import { IAuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class ReactPostData {
  @IsUUID()
  @ApiProperty()
      postId: string
}

export class ReactPostInput implements IAuthInput<ReactPostData> {
  @IsUUID("4")
  @ApiProperty()
      userId: string
  data: ReactPostData
}
