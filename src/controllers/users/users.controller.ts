import {
    Body,
    Controller, Patch, UseGuards, UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger"
import { UsersService } from "./users.service"
import { AuthInterceptor, JwtAuthGuard, UserId } from "../shared"
import { FollowOrUnfollowData } from "./users.input"

@ApiTags("Users")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/users")
export class UsersController{
    constructor(private readonly usersService: UsersService) { }

    @ApiBearerAuth()
    @Patch("follow-or-unfollow")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async followOrUnfollow(@UserId() userId: string, @Body() body: FollowOrUnfollowData) {
        return this.usersService.followOrUnfollow({
            userId,
            data: body,
        })
    }
}
