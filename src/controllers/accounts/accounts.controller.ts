import {
    Body,
    Controller, Patch, UseGuards, UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger"
import { UsersService } from "./accounts.service"
import { AuthInterceptor, JwtAuthGuard, AccountId } from "../shared"
import { ToggleFollowInputData, UpdateCourseApprovalInputData } from "./accounts.input"

@ApiTags("Users")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/accounts")
export class UsersController{
    constructor(private readonly accountsService: UsersService) { }

    @ApiBearerAuth()
    @Patch("toggle-follow")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async toggleFollow(@AccountId() accountId: string, @Body() body: ToggleFollowInputData) {
        return this.accountsService.toggleFollow({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Patch("update-course-approval")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async updateCourseAprroval(@AccountId() accountId: string, @Body() body: UpdateCourseApprovalInputData) {
        return this.accountsService.updateCourseApproval({
            accountId,
            data: body,
        })
    }
}
