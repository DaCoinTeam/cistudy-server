import { AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsUUID } from "class-validator"

export class UpdateProfileData {
    @ApiProperty()
        username?: string
    @IsNumber()
    @ApiProperty()
        avatarIndex?: number

    @IsNumber()
    @ApiProperty()
        coverPhotoIndex?: number
}
export class UpdateProfileInput implements AuthInput<UpdateProfileData> {
    @IsUUID("4")
    	userId: string
    data: UpdateProfileData
    files: Array<Express.Multer.File>
}

