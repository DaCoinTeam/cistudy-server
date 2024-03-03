import {
    Body,
    Controller, Patch, UseGuards, UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger"
import { UsersService } from "./users.service"
import { AuthInterceptor, JwtAuthGuard, UserId } from "../shared"
import { ToggleFollowInputData } from "./users.input"

@ApiTags("Users")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/users")
export class UsersController{
    constructor(private readonly usersService: UsersService) { }

    @ApiBearerAuth()
    @Patch("toggle-follow")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async toggleFollow(@UserId() userId: string, @Body() body: ToggleFollowInputData) {
        return this.usersService.toggleFollow({
            userId,
            data: body,
        })
    }
}
