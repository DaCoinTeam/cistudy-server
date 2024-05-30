import { Resolver, Query, Args } from "@nestjs/graphql"
import { UsersService } from "./users.service"
import { FindManyCreatedCoursesInputData, FindManyFollowersInputData, FindManyUsersInputData, FindOneUserInputData } from "./users.input"
import { CourseMySqlEntity, UserMySqlEntity } from "@database"
import { FindManyUsersOutput } from "./user.output"
import { AuthInterceptor, JwtAuthGuard, UserId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"

@Resolver()
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }
    
  @Query(() => UserMySqlEntity)
    async findOneUser(@Args("data") data: FindOneUserInputData) {
        return this.usersService.findOneUser({ data })
    }

  @Query(() => [UserMySqlEntity])
  async findManyFollowers(@Args("data") data: FindManyFollowersInputData) {
      return this.usersService.findManyFollowers({ data })
  }

  @Query(() => [CourseMySqlEntity])
  async findManyCreatedCourses(@Args("data") data: FindManyCreatedCoursesInputData) {
      return this.usersService.findManyCreatedCourses({ data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyUsersOutput)
  async findManyUsers(@UserId() userId: string, @Args("data") data: FindManyUsersInputData) {
      return this.usersService.findManyUsers({ userId, data })
  }
}

