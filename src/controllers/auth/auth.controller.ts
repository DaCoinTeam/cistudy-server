import {
    Body,
    Controller,
    Post,
    UseInterceptors,
    Get,
    Query,
} from "@nestjs/common"
import { ApiHeader, ApiTags } from "@nestjs/swagger"
import { SignInInputData, SignUpData } from "./auth.input"
import { AuthService } from "./auth.service"
import { AuthInterceptor, GenerateAuthTokensInterceptor } from "../shared"

@ApiTags("Auth")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}
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

  @Get("verify-google-access-token")
  @UseInterceptors(AuthInterceptor)
  async verifyGoogleAccessToken(@Query("token") token: string) {
      return this.authService.verifyGoogleAccessToken({ data: { token } })
  }
}
