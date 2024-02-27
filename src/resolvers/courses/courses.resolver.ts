import { Resolver, Query, Args } from "@nestjs/graphql"
import { FindOneCourseData, FindManyCoursesData, FindManyLecturesData, FindManyResourcesData, FindOneLectureData } from "./courses.input"
import { CoursesService } from "./courses.service"
import { CourseMySqlEntity, LectureMySqlEntity } from "@database"
import { FindManyResourcesOutput, FindOneLectureOutput } from "./courses.output"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import { JwtAuthGuard, AuthInterceptor, UserId } from "../shared"

@Resolver()
export class CoursesResolver {
    constructor(
    private readonly coursesService: CoursesService,
    ) { }

  @Query(() => CourseMySqlEntity)
    async findOneCourse(@Args("data") data: FindOneCourseData) {
        return await this.coursesService.findOneCourse({ data })
    }

  @Query(() => [CourseMySqlEntity])
  async findManyCourses(@Args("data", { nullable: true }) data: FindManyCoursesData) {
      return await this.coursesService.findManyCourses({ data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindOneLectureOutput)
  async findOneLecture(@UserId() userId: string, @Args("data") data: FindOneLectureData) {
      return await this.coursesService.findOneLecture({ userId, data })
  }

  @Query(() => [LectureMySqlEntity])
  async findManyLectures(@Args("data") data: FindManyLecturesData) {
      return await this.coursesService.findManyLectures({ data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyResourcesOutput)
  async findManyResources(@UserId() userId: string, @Args("data") data: FindManyResourcesData) {
      return await this.coursesService.findManyResources({ userId, data })
  }
}
