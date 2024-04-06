import { AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class UpdateProfileData {
    @ApiProperty()
        username?: string
    @ApiProperty()
        avatarIndex?: number
    @ApiProperty()
        coverPhotoIndex?: number
    @ApiProperty()
        birthdate?: Date
}
export class UpdateProfileInput implements AuthInput<UpdateProfileData> {
    @IsUUID("4")
    	userId: string
    data: UpdateProfileData
    files: Array<Express.Multer.File>
}

