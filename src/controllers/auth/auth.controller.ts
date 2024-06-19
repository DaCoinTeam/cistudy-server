import {
    Body,
    Controller,
    Post,
    UseInterceptors,
} from "@nestjs/common"
import { ApiHeader, ApiTags } from "@nestjs/swagger"
import { SignInInputData, SignUpData } from "./auth.input"
import { AuthService } from "./auth.service"
import { GenerateAuthTokensInterceptor } from "../shared"
import { SignInInterceptor } from "../shared/interceptors/signIn.interceptor"

@ApiTags("Auth")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}
  @Post("sign-in")
  @UseInterceptors(SignInInterceptor)
    async signIn(@Body() body: SignInInputData) {
        return this.authService.signIn({ data: body })
    }

  @Post("sign-up")
  @UseInterceptors(GenerateAuthTokensInterceptor)
  async signUp(@Body() body: SignUpData) {
      return this.authService.signUp({ data: body })
  }
}
