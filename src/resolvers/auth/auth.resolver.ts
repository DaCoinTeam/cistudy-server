import { Resolver, Query, Args } from "@nestjs/graphql"
import { AuthService } from "./auth.service"
import { AuthInterceptor, GenerateAuthTokensInterceptor, JwtAuthGuard, AccountId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import { InitOutput, SignInOutput, VerifyGoogleAccessTokenOutput } from "./auth.output"
import { SignInInputData, VerifyGoogleAccessTokenData } from "./auth.input"
import { SignInInterceptor } from "src/controllers/shared/interceptors/signIn.interceptor"

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => InitOutput)
    async init(@AccountId() accountId: string) {
        return this.authService.init({ accountId })
    }

  @UseInterceptors(GenerateAuthTokensInterceptor)
  @Query(() => SignInOutput)
  async signIn(@Args("data") data: SignInInputData ) {
      return this.authService.signIn({ data })
  }

  @UseInterceptors(GenerateAuthTokensInterceptor)
  @Query(() => VerifyGoogleAccessTokenOutput)
  async verifyGoogleAccessToken(@Args("data") data: VerifyGoogleAccessTokenData ) {
      return this.authService.verifyGoogleAccessToken({ data })
  }
}
