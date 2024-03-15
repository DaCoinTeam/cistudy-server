import { Resolver, Query, Args } from "@nestjs/graphql"
import { AuthService } from "./auth.service"
import { AuthInterceptor, GenerateAuthTokensInterceptor, JwtAuthGuard, UserId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import { InitOutput, SignInOutput, VerifyGoogleAccessTokenOutput } from "./auth.output"
import { SignInInputData, VerifyGoogleAccessTokenData } from "./auth.input"

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => InitOutput)
    async init(@UserId() userId: string) {
        return this.authService.init({ userId })
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
