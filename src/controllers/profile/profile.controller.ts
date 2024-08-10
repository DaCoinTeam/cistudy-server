import { Files, SystemRoles } from "@common"
import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    Put,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiTags } from "@nestjs/swagger"
import { AccountId, AuthInterceptor, DataFromBody, JwtAuthGuard, Roles } from "../shared"
import { DepositData, IsSastifyCommunityStandardInput, MarkNotificationAsReadInputData, UpdateProfileData, WithdrawData } from "./profile.input"
import { updateProfileSchema } from "./profile.schema"
import { ProfileService } from "./profile.service"

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

    @ApiBearerAuth()
    @Patch("mark-notification-as-read")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor
    )
    async markNotificationAsRead(
        @AccountId() accountId: string,
        @Body() data: MarkNotificationAsReadInputData,
    ) {     
    	return this.profileService.markNotificationAsRead({
    		accountId,
            data
    	}) 
    }

    @ApiBearerAuth()
    @Patch("mark-all-notifications-as-read")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor
    )
    async markAllNotificationsAsRead(
        @AccountId() accountId: string,
    ) {     
    	return this.profileService.markAllNotificationsAsRead({
    		accountId
    	}) 
    }

    @ApiBearerAuth()
    @Delete("delete-notification/:notificationId")
    @UseGuards(JwtAuthGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteNotification(
        @AccountId() accountId: string, 
        @Param("notificationId") notificationId: string
    ) {
        return await this.profileService.deleteNotification({
            accountId, data: {
                notificationId
            }
        })
    }

    @Post("is-sastify-community-standard")
    async isSastifyCommunityStandard(
        @Body() body: IsSastifyCommunityStandardInput
    ) {
        return await this.profileService.isSastifyCommunityStandard(body)
    }
}
