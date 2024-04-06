import {
    Controller,
    UseInterceptors,
    UseGuards,
    UploadedFiles,
    Put,
} from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiTags } from "@nestjs/swagger"
import { UserId, AuthInterceptor, JwtAuthGuard, DataFromBody } from "../shared"
import { Files } from "@common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ProfileService } from "./profile.service"
import { UpdateProfileData } from "./profile.input"
import { updateProfileSchema } from "./profile.schema"

@ApiTags("Profile")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/profile")
export class ProfileController{
    constructor(private readonly profileService: ProfileService) { }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updateProfileSchema })
    @Put("update-profile")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
    )
    async updateProfile(
        @UserId() userId: string,
        @DataFromBody() data: UpdateProfileData,
        @UploadedFiles() { files }: Files,
    ) {     
        console.log(data)
    	return this.profileService.updateProfile({
    		userId,
            data,
    		files
    	}) 
    }
}
