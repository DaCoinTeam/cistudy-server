import {
    Body,
    Controller, Delete, Param, Patch, Post, UseGuards, UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger"
import { UsersService } from "./accounts.service"
import { AuthInterceptor, JwtAuthGuard, AccountId } from "../shared"
import { CreateUserReviewInputData, DeleteCourseInputData, ToggleFollowInputData, UpdateUserReviewInputData, VerifyCourseInputData } from "./accounts.input"

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
    @Patch("verify-course")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async updateCourseAprroval(@AccountId() accountId: string, @Body() body: VerifyCourseInputData) {
        return this.accountsService.verifyCourse({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("delete-courses")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteCourses(@AccountId() accountId: string, @Body() body: DeleteCourseInputData) {
        return this.accountsService.deleteCourses({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("create-user-review")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createUserReview(
        @AccountId() accountId: string,
        @Body() body: CreateUserReviewInputData,
    ) {
        return this.accountsService.createUserReview({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Patch("update-user-review")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async updateCourseReview(
        @AccountId() accountId: string,
        @Body() body: UpdateUserReviewInputData,
    ) {
        return this.accountsService.updateUserReview({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-user-review/:userReviewId")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteUserReview(
        @AccountId() accountId: string,
        @Param("userReviewId") userReviewId: string,
    ) {
        return this.accountsService.deleteUserReview({
            accountId,
            data: { userReviewId }
        })
    }
}
