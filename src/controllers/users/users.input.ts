import { AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class ToggleFollowInputData {
    @IsUUID("4")
    @ApiProperty()
        followedUserId: string
}

export class ToggleFollowInput implements AuthInput<ToggleFollowInputData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: ToggleFollowInputData
}