import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common"
import { TestService } from "./test.service"
import { TryInput } from "./test.input"
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger"
import { AuthInterceptor, JwtAuthGuard, UserId } from "../shared"

@ApiTags("Cuongdeptrai")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/v1/test")
export class TestController {

    constructor(
        private readonly testService: TestService
    ) { }
    
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Post("try")
    async try(
        @UserId() userId: string,
        @Body() body: TryInput
    ) {
        console.log(userId)
        return await this.testService.try(body)
    }
}