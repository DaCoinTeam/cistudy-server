import { ApiProperty } from "@nestjs/swagger"

export class TryInput {
    @ApiProperty()
        hello: string
    @ApiProperty()
        world: string
}