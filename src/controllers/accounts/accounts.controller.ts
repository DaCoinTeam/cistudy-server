import {
    Body,
    Controller, Delete, Param, Patch, Post, UseGuards, UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger"
import { AccountsService } from "./accounts.service"
import { AuthInterceptor, JwtAuthGuard, AccountId, Roles } from "../shared"
import { CreateAccountReviewInputData, DeleteCourseInputData, ToggleFollowInputData, UpdateAccountReviewInputData, VerifyCourseInputData } from "./accounts.input"
import { RolesGuard } from "../shared/guards/role.guard"
import { AccountRole } from "@common"

@ApiTags("Accounts")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/accounts")
export class AccountsController{
    constructor(private readonly accountsService: AccountsService) { }

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
    @Patch("verify-course")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(AccountRole.Moderator, AccountRole.Administrator)
    @UseInterceptors(AuthInterceptor)
    async verifyCourse(@AccountId() accountId: string, @Body() body: VerifyCourseInputData) {
        return this.accountsService.verifyCourse({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("delete-courses")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(AccountRole.Administrator)
    @UseInterceptors(AuthInterceptor)
    async deleteCourses(@AccountId() accountId: string, @Body() body: DeleteCourseInputData) {
        return this.accountsService.deleteCourses({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("create-account-review")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createAccountReview(
        @AccountId() accountId: string,
        @Body() body: CreateAccountReviewInputData,
    ) {
        return this.accountsService.createAccountReview({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Patch("update-account-review")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async updateAccountReview(
        @AccountId() accountId: string,
        @Body() body: UpdateAccountReviewInputData,
    ) {
        return this.accountsService.updateAccountReview({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-account-review/:accountReviewId")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteAccountReview(
        @AccountId() accountId: string,
        @Param("accountReviewId") accountReviewId: string,
    ) {
        return this.accountsService.deleteAccountReview({
            accountId,
            data: { accountReviewId }
        })
    }
}
