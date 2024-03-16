import { Resolver, Query, Args } from "@nestjs/graphql"
import { ProfileService } from "./profile.service"
import { FindManyEnrolledCoursesInputData, FindManySelfCreatedCoursesInputData } from "./profile.input"
import { AuthInterceptor, JwtAuthGuard, UserId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import {
    FindManyEnrolledCoursesOutput,
    FindManySelfCreatedCoursesOutput,
} from "./profile.output"

@Resolver()
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManySelfCreatedCoursesOutput)
    async findManySelfCreatedCourses(
    @UserId() userId: string,
    @Args("data") data: FindManySelfCreatedCoursesInputData,
    ) {
        return this.profileService.findManySelfCreatedCourses({ userId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyEnrolledCoursesOutput)
  async findManyEnrolledCourses(
      @UserId() userId: string,
      @Args("data") data: FindManyEnrolledCoursesInputData,
  ) {
      return this.profileService.findManyEnrolledCourses({ userId, data })
  }
}
