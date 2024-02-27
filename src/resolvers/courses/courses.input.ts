import { Field, ID, InputType } from "@nestjs/graphql"
import { AuthInput, Input } from "@common"

@InputType()
export class FindOneCourseData {
  @Field(() => ID)
      courseId: string
}

export class FindOneCourseInput implements Input<FindOneCourseData> {
    data: FindOneCourseData
}

@InputType()
export class FindOneLectureData {
  @Field(() => ID)
      lectureId: string
}

export class FindOneLectureInput implements AuthInput<FindOneLectureData> {
    userId: string
    data: FindOneLectureData
}

@InputType()
export class FindManyLecturesData {
  @Field(() => ID)
      sectionId: string
}

export class FindManyLecturesInput implements Input<FindManyLecturesData> {
    data: FindManyLecturesData
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

@InputType()
export class FindManyResourcesData {
  @Field(() => ID)
      lectureId: string
}

export class FindManyResourcesInput implements AuthInput<FindManyResourcesData> {
    userId: string
    data: FindManyResourcesData
}
