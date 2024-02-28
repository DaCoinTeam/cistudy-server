import { AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class FollowOrUnfollowData {
    @IsUUID("4")
    @ApiProperty()
        followedUserId: string
}

export class FollowOrUnfollowInput implements AuthInput<FollowOrUnfollowData> {
    @IsUUID("4")
    @ApiProperty()
        userId: string
    data: FollowOrUnfollowData
}