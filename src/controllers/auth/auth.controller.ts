import {
    Body,
    Controller,
    Post,
    UseInterceptors,
    Get,
    Query,
} from "@nestjs/common"
import { ApiQuery, ApiTags } from "@nestjs/swagger"
import { SignInData, SignUpData, } from "../shared"
import { AuthService } from "./auth.service"
import {
    AuthInterceptor,
    GenerateAuthTokensInterceptor,
} from "../shared"
import { UserMySqlEntity } from "@database"

@ApiTags("Auth")
@ApiQuery({
    name: "clientId",
    example: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService){}
  @Post("sign-in")
  @UseInterceptors(GenerateAuthTokensInterceptor<UserMySqlEntity>)
    async signIn(@Body() body: SignInData) {
        return this.authService.signIn({ data: body })
    }

  @Post("sign-up")
  @UseInterceptors(GenerateAuthTokensInterceptor<UserMySqlEntity>)
  async signUp(@Body() body: SignUpData) {
  	return this.authService.signUp({ data: body })
  }

  @Get("verify-google-access-token")
  @UseInterceptors(AuthInterceptor<UserMySqlEntity>)
  async verifyGoogleAccessToken(@Query("token") token: string) {
  	return this.authService.verifyGoogleAccessToken({ data: token })
  }
}
