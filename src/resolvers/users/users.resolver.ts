import { Resolver, Query, Args } from "@nestjs/graphql"
import { UsersService } from "./users.service"
import { FindManyCreatedCoursesData, FindManyFollowersData, FindOneUserData } from "./users.input"
import { CourseMySqlEntity, UserMySqlEntity } from "@database"

@Resolver()
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

  @Query(() => UserMySqlEntity)
    async findOneUser(@Args("data") data: FindOneUserData) {
        return this.usersService.findOneUser({ data })
    }

    @Query(() => [UserMySqlEntity])
  async findManyFollowers(@Args("data") data: FindManyFollowersData) {
      return this.usersService.findManyFollowers({ data })
  }

  @Query(() => [CourseMySqlEntity])
    async findManyCreatedCourses(@Args("data") data: FindManyCreatedCoursesData) {
        return this.usersService.findManyCreatedCourses({ data })
    }
}
