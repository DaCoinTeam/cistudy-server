import {
    Controller,
    UseInterceptors,
    UseGuards,
    UploadedFiles,
    Patch,
} from "@nestjs/common"
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger"
import { UserId, AuthInterceptor, JwtAuthGuard } from "../shared"
import { UserMySqlEntity } from "@database"
import { Files } from "@common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ProfileService } from "./profile.service"

@ApiTags("Profile")
@ApiQuery({
    name: "clientId",
    example: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/profile")
export class ProfileController{
    constructor(private readonly profileService: ProfileService) { }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @Patch("update-cover-photo")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor<UserMySqlEntity>,
        FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
    )
    async updateCoverPhoto(
        @UserId() userId: string,
        @UploadedFiles() { files }: Files,
    ) {     
    	return this.profileService.updateCoverPhoto({
    		userId,
    		files
    	}) 
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @Patch("update-avatar")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor<UserMySqlEntity>,
        FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
    )
    async updateAvatar(
        @UserId() userId: string,
        @UploadedFiles() { files }: Files,
    ) {     
    	return this.profileService.updateAvatar({
    		userId,
    		files
    	}) 
    }
}
