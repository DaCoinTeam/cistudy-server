import { Resolver, Query, Args } from "@nestjs/graphql"
import { FindOneCourseData, FindManyCoursesData } from "./courses.input"
import { CoursesService } from "./courses.service"
import { CourseMySqlEntity } from "@database"

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
}
