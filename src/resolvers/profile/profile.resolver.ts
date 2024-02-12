import { Resolver, Query } from "@nestjs/graphql"
import { ProfileService } from "./profile.service"
import { UserMySqlEntity } from "@database"
import { AuthInterceptor, JwtAuthGuard, UserId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import { FindProfileByBearerTokenOutput } from "./profile.output"

@Resolver(() => UserMySqlEntity)
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor<UserMySqlEntity>)
  @Query(() => FindProfileByBearerTokenOutput)
    async findProfileByBearerToken(@UserId() userId: string) {
        return this.profileService.findProfileByBearerToken({ userId })
    }
}
