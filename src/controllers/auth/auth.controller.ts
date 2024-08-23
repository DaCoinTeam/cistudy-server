import {
    Body,
    Controller,
    Patch,
    Post,
    UseInterceptors,
} from "@nestjs/common"
import { ApiHeader, ApiTags } from "@nestjs/swagger"
import { GenerateAuthTokensInterceptor } from "../shared"
import { ForgotPasswordInputData, ResetPasswordInputData, SignInInputData, SignUpData, VerifyRegistrationInputData } from "./auth.input"
import { AuthService } from "./auth.service"

@ApiTags("Auth")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post("sign-in")
    @UseInterceptors(GenerateAuthTokensInterceptor)
    async signIn(@Body() body: SignInInputData) {
        return this.authService.signIn({ data: body })
    }

    @Post("sign-up")
    //@UseInterceptors(GenerateAuthTokensInterceptor)
    async signUp(@Body() body: SignUpData) {
        return this.authService.signUp({ data: body })
    }

    @Post("forgot-password")
    //@UseInterceptors(GenerateAuthTokensInterceptor)
    async forgotPassword(@Body() body: ForgotPasswordInputData) {
        return this.authService.forgotPassword({ data: body })
    }

    @Patch("verify-registration")
    async verifyRegistration(
        @Body() data: VerifyRegistrationInputData,
    ){
        return this.authService.verifyRegistration({ data})
    }

    @Patch("reset-password")
    async resetPassword(
        @Body() data: ResetPasswordInputData,
    ){
        return this.authService.resetPassword({ data})
    }

}
