import { UseGuards, UseInterceptors } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { AccountId, AuthInterceptor, GenerateAuthTokensInterceptor, JwtAuthGuard } from "../shared"
import { SignInInputData, VerifyGoogleAccessTokenData } from "./auth.input"
import { InitLandingPageOutputOthers, InitOutput, SignInOutput, VerifyGoogleAccessTokenOutput } from "./auth.output"
import { AuthService } from "./auth.service"

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => InitOutput)
    async init(@AccountId() accountId: string) {
        return this.authService.init({ accountId })
    }


  @Query(() => InitLandingPageOutputOthers)
  async initLandingPage() {
      return this.authService.initLandingPage()
  }

  @UseInterceptors(GenerateAuthTokensInterceptor)
  @Query(() => SignInOutput)
  async signIn(@Args("data") data: SignInInputData) {
      return this.authService.signIn({ data })
  }

  @UseInterceptors(GenerateAuthTokensInterceptor)
  @Query(() => VerifyGoogleAccessTokenOutput)
  async verifyGoogleAccessToken(@Args("data") data: VerifyGoogleAccessTokenData) {
      return this.authService.verifyGoogleAccessToken({ data })
  }
}
