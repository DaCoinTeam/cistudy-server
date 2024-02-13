import { Input } from "@common"
import { ApiProperty } from "@nestjs/swagger"

export class GetInput implements Input<string>  {
  @ApiProperty()
  	data: string
}
