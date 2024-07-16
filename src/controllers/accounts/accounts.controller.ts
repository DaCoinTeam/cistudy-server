import {
    Body,
    Controller, Delete, Param, Patch, Post, UseGuards, UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger"
import { AccountsService } from "./accounts.service"
import { AuthInterceptor, JwtAuthGuard, AccountId, Roles } from "../shared"
import { CreateAccountReportInputData, CreateAccountReviewInputData, CreateAccountRoleInputData, DeleteCourseInputData, ResolveAccountReportInputData, ToggleFollowInputData, ToggleRoleInputData, UpdateAccountReportInputData, UpdateAccountReviewInputData, UpdateAccountRoleInputData, VerifyCourseInputData } from "./accounts.input"
import { RolesGuard } from "../shared/guards/role.guard"
import { SystemRoles } from "@common"

@ApiTags("Accounts")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/accounts")
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) { }

    @ApiBearerAuth()
    @Patch("toggle-follow")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
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
    @Roles(SystemRoles.User, SystemRoles.Moderator)
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
    @Roles(SystemRoles.User, SystemRoles.Administrator)
    @UseInterceptors(AuthInterceptor)
    async deleteCourses(@AccountId() accountId: string, @Body() body: DeleteCourseInputData) {
        return this.accountsService.deleteCourses({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("create-account-review")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
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

    @ApiBearerAuth()
    @Post("create-account-role")
    @UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(SystemRoles.User, SystemRoles.Administrator)
    @UseInterceptors(AuthInterceptor)
    async createAccountRole(
        @AccountId() accountId: string,
        @Body() body: CreateAccountRoleInputData,
    ) {
        return this.accountsService.createAccountRole({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("toggle-role")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User, SystemRoles.Administrator)
    @UseInterceptors(AuthInterceptor)
    async toggleRole(
        @AccountId() accountId: string,
        @Body() body: ToggleRoleInputData,
    ) {
        return this.accountsService.toggleRole({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Patch("update-account-role")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User, SystemRoles.Administrator)
    @UseInterceptors(AuthInterceptor)
    async updateAccountRole(
        @AccountId() accountId: string,
        @Body() body: UpdateAccountRoleInputData,
    ) {
        return this.accountsService.updateAccountRole({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("create-account-report")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createAccountReport(
        @AccountId() accountId: string,
        @Body() body: CreateAccountReportInputData,
    ) {
        return this.accountsService.createAccountReport({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Patch("update-account-report")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updateAccountReport(
        @AccountId() accountId: string,
        @Body() body: UpdateAccountReportInputData,
    ) {
        return this.accountsService.updateAccountReport({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Patch("resolve-account-report")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User, SystemRoles.Moderator)
    @UseInterceptors(AuthInterceptor)
    async resolveAccountReport(
        @AccountId() accountId: string,
        @Body() body: ResolveAccountReportInputData,
    ) {
        return this.accountsService.resolveAccountReport({
            accountId,
            data: body,
        })
    }
}
