import { Resolver, Query, Args } from "@nestjs/graphql"
import { FindProfileByBearerTokenInput } from "./profile.input"
import { ProfileService } from "./profile.service"
import { UserMySqlEntity } from "@database"

@Resolver(() => UserMySqlEntity)
export class ProfileResolver {
    constructor(
    private readonly profileService: ProfileService,
    ) {}
  @Query(() => UserMySqlEntity)
    async findProfileByBearerToken(@Args("input") input: FindProfileByBearerTokenInput) {
        return this.profileService.findProfileByBearerToken(input)
    }
}
