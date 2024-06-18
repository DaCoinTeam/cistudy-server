import { Resolver, Query, Args } from "@nestjs/graphql"
import { UsersService } from "./accounts.service"
import { FindManyCreatedCoursesInputData, FindManyFollowersInputData, FindManyUserReviewsInputData, FindManyAccountsInputData, FindOneAccountInputData} from "./accounts.input"
import { CourseMySqlEntity, AccountMySqlEntity } from "@database"
import { FindManyUserReviewsOutputData, FindManyAccountsOutput } from "./accounts.output"
import { AuthInterceptor, JwtAuthGuard, AccountId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"

@Resolver()
export class UsersResolver {
    constructor(private readonly accountsService: UsersService) { }
    
  @Query(() => AccountMySqlEntity)
    async findOneAccount(@Args("data") data: FindOneAccountInputData) {
        return this.accountsService.findOneAccount({ data })
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
  @Query(() => FindManyAccountsOutput)
  async findManyUsers(@AccountId() accountId: string, @Args("data") data: FindManyAccountsInputData) {
      return this.accountsService.findManyUsers({ accountId, data })
  }

  @Query(() => FindManyUserReviewsOutputData)
    async findManyCourseReviews(@Args("data") data : FindManyUserReviewsInputData) {
        return await this.accountsService.findManyUserReviews({data})
    }
}

