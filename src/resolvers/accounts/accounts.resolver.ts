import { Resolver, Query, Args } from "@nestjs/graphql"
import { UsersService } from "./accounts.service"
import { FindManyCreatedCoursesInputData, FindManyFollowersInputData, FindManyUserReviewsInputData, FindManyUsersInputData, FindOneUserInputData } from "./accounts.input"
import { CourseMySqlEntity, AccountMySqlEntity } from "@database"
import { FindManyUserReviewsOutputData, FindManyUsersOutput } from "./accounts.output"
import { AuthInterceptor, JwtAuthGuard, AccountId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"

@Resolver()
export class UsersResolver {
    constructor(private readonly accountsService: UsersService) { }
    
  @Query(() => AccountMySqlEntity)
    async findOneUser(@Args("data") data: FindOneUserInputData) {
        return this.accountsService.findOneUser({ data })
    }

  @Query(() => [AccountMySqlEntity])
  async findManyFollowers(@Args("data") data: FindManyFollowersInputData) {
      return this.accountsService.findManyFollowers({ data })
  }

  @Query(() => [CourseMySqlEntity])
  async findManyCreatedCourses(@Args("data") data: FindManyCreatedCoursesInputData) {
      return this.accountsService.findManyCreatedCourses({ data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyUsersOutput)
  async findManyUsers(@AccountId() accountId: string, @Args("data") data: FindManyUsersInputData) {
      return this.accountsService.findManyUsers({ accountId, data })
  }

  @Query(() => FindManyUserReviewsOutputData)
    async findManyCourseReviews(@Args("data") data : FindManyUserReviewsInputData) {
        return await this.accountsService.findManyUserReviews({data})
    }
}

