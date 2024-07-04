import { AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"
import { Address } from "web3"

export class UpdateProfileData {
    @ApiProperty()
        username?: string
    @ApiProperty()
        avatarIndex?: number
    @ApiProperty()
        coverPhotoIndex?: number
    @ApiProperty()
        birthdate?: Date
    @ApiProperty()
        walletAddress?: Address
}
export class UpdateProfileInput implements AuthInput<UpdateProfileData> {
    @IsUUID("4")
    	accountId: string
    data: UpdateProfileData
    files: Array<Express.Multer.File>
}

