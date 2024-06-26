import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    Res,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger"
import { SignInInputData, SignUpData, VerifyRegistrationInputData } from "./auth.input"
import { AuthService } from "./auth.service"
import { AccountId, GenerateAuthTokensInterceptor } from "../shared"
import { Response } from "express"
import { JwtAuthGuard } from "@resolvers"

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
    @UseInterceptors(GenerateAuthTokensInterceptor)
    async signUp(@Body() body: SignUpData) {
        return this.authService.signUp({ data: body })
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch('verify-registration')
    async verifyRegistration(
        @Body() data: VerifyRegistrationInputData,
        @AccountId() accountId : string
    ){
    return this.authService.verifyRegistration({accountId, data});
    }

    @Get('verify-registration-page')
    async getAccountVerificationLink(@Res() res: Response) {
        const verificationLink = `https://www.facebook.com/`;
        return res.redirect(verificationLink);
    }
}
