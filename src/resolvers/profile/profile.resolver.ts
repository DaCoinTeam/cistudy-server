import { Resolver, Query } from "@nestjs/graphql"
import { ProfileService } from "./profile.service"
import { UserMySqlEntity } from "@database"
import { AuthInterceptor, JwtAuthGuard, UserId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import { FindProfileByAuthTokenOutput } from "./profile.output"

@Resolver(() => UserMySqlEntity)
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindProfileByAuthTokenOutput)
    async findProfile(@UserId() userId: string) {
        return this.profileService.findProfile({ userId })
    }
}
