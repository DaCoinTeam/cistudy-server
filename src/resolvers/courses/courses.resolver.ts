import { Resolver, Query, Args } from "@nestjs/graphql"
import { FindOneCourseData, FindManyCoursesData, FindOneLectureData } from "./courses.input"
import { CoursesService } from "./courses.service"
import { CourseMySqlEntity, LectureMySqlEntity } from "@database"

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

  @Query(() => LectureMySqlEntity)
  async findOneLecture(@Args("data") data: FindOneLectureData) {
      return await this.coursesService.findOneLecture({ data })
  }
}
