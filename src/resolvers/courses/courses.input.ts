import { Field, ID, InputType } from "@nestjs/graphql"
import { Input } from "@common"
@InputType()
export class FindOneCourseData {
  @Field(() => ID)
  	courseId: string
}

export class FindOneCourseInput implements Input<FindOneCourseData> {
  	data: FindOneCourseData
}

@InputType()
export class CourseFilterInput {
  @Field(() => String, { nullable: true })
      category: string
}

@InputType()
export class FindManyCoursesData {
  @Field(() => CourseFilterInput, { nullable: true })
      filter: CourseFilterInput
}

export class FindManyCoursesInput implements Input<FindManyCoursesData> {
  	data: FindManyCoursesData
}