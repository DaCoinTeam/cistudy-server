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
import { AddJobInputData, AddQualificationInputData, DepositData, IsSastifyCommunityStandardInput, MarkNotificationAsReadInputData, UpdateJobInputData, UpdateProfileData, UpdateQualificationInputData, WithdrawData } from "./profile.input"
import { addJobSchema, addQualificationSchema, updateJobSchema, updateProfileSchema, updateQualificationSchema } from "./profile.schema"
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
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: addJobSchema })
    @Post("add-job")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
    )
    async addJob(
        @AccountId() accountId: string,
        @DataFromBody() data: AddJobInputData,
        @UploadedFiles() { files }: Files,
    ) {     
    	return this.profileService.addJob({
    		accountId,
            data,
    		files
    	}) 
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updateJobSchema })
    @Put("update-account-job")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
    )
    async updateJob(
        @AccountId() accountId: string,
        @DataFromBody() data: UpdateJobInputData,
        @UploadedFiles() { files }: Files,
    ) {     
    	return this.profileService.updateJob({
    		accountId,
            data,
    		files
    	}) 
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: addQualificationSchema })
    @Post("add-qualification")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
    )
    async addQualification(
        @AccountId() accountId: string,
        @DataFromBody() data: AddQualificationInputData,
        @UploadedFiles() { files }: Files,
    ) {     
    	return this.profileService.addQualification({
            data,
    		accountId,
    		files
    	}) 
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updateQualificationSchema })
    @Put("update-qualification")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
    )
    async updateQualification(
        @AccountId() accountId: string,
        @DataFromBody() data: UpdateQualificationInputData,
        @UploadedFiles() { files }: Files,
    ) {     
    	return this.profileService.updateQualification({
            data,
    		accountId,
    		files
    	}) 
    }

    @ApiBearerAuth()
    @Delete("delete-job/:accountJobId")
    @UseGuards(JwtAuthGuard)
    //@Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deletePost(@AccountId() accountId: string, @Param("accountJobId") accountJobId: string) {
        return await this.profileService.deleteJob({
            accountId, data: {
                accountJobId
            }
        })
    }

    @ApiBearerAuth()
    @Delete("delete-qualification/:accountQualificationId")
    @UseGuards(JwtAuthGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteAccountQualification(@AccountId() accountId: string, @Param("accountQualificationId") accountQualificationId: string) {
        return await this.profileService.deleteQualification({
            accountId, data: {
                accountQualificationId
            }
        })
    }

    @ApiBearerAuth()
    @Patch("register-instructor")
    @UseGuards(JwtAuthGuard)
    //@Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async registerInstructor(
        @AccountId() accountId: string,
    ) {
        return await this.profileService.registerInstructor({
            accountId
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
