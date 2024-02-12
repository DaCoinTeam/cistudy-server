import { Resolver, Query, Args } from "@nestjs/graphql"
import { FindOneCourseInput, FindManyCoursesInput } from "./courses.input"
import { CoursesService } from "./courses.service"
import { CourseMySqlEntity } from "@database"

@Resolver(() => CourseMySqlEntity)
export class CoursesResolver {
    constructor(
    private readonly coursesService: CoursesService,
    ) {}
  @Query(() => CourseMySqlEntity)
    async findOneCourse(@Args("input") input: FindOneCourseInput) {
        return await this.coursesService.findOneCourse(input)
    }

	@Query(() => [CourseMySqlEntity])
  async findManyCourses(@Args("input", { nullable: true }) input: FindManyCoursesInput) {
  	return await this.coursesService.findManyCourses(input)
  }
}
