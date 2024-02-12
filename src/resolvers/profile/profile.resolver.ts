import { Resolver, Query } from "@nestjs/graphql"
import { ProfileService } from "./profile.service"
import { UserMySqlEntity } from "@database"
import { JwtAuthGuard, UserId } from "../shared"
import { UseGuards } from "@nestjs/common"

@Resolver(() => UserMySqlEntity)
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => UserMySqlEntity)
    async findProfileByBearerToken(@UserId() userId: string) {
        console.log(userId)
        return this.profileService.findProfileByBearerToken({ userId })
    }
}
