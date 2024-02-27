import { AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsUUID } from "class-validator"

export class UpsertFollowData {
    @IsUUID("4")
    @ApiProperty()
        followedUserId: string
    @IsBoolean()
    @ApiProperty()
        followed: boolean
}

export class UpsertFollowInput implements AuthInput<UpsertFollowData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: UpsertFollowData
}