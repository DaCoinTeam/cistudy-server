import {
    Controller,
    UseInterceptors,
    UseGuards,
    UploadedFiles,
    Put,
    Patch,
    Body,
} from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiTags } from "@nestjs/swagger"
import { AccountId, AuthInterceptor, JwtAuthGuard, DataFromBody } from "../shared"
import { Files } from "@common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ProfileService } from "./profile.service"
import { DepositData, UpdateProfileData, WithdrawData } from "./profile.input"
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
        @AccountId() accountId: string,
        @DataFromBody() data: UpdateProfileData,
        @UploadedFiles() { files }: Files,
    ) {     
    	return this.profileService.updateProfile({
    		accountId,
            data,
    		files
    	}) 
    }

    @ApiBearerAuth()
    @Patch("withdraw")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor
    )
    async withdraw(
        @AccountId() accountId: string,
        @Body() data: WithdrawData,
    ) {     
    	return this.profileService.withdraw({
    		accountId,
            data
    	}) 
    }

    @ApiBearerAuth()
    @Patch("deposit")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor
    )
    async deposit(
        @AccountId() accountId: string,
        @Body() data: DepositData,
    ) {     
    	return this.profileService.deposit({
    		accountId,
            data
    	}) 
    }


}
