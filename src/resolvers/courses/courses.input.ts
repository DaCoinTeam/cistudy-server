import { Field, ID, InputType } from "@nestjs/graphql"
import { AuthInput, Input, ParamsWithOptions } from "@common"

@InputType()
export class FindOneCourseInputData {
    @Field(() => ID)
        courseId: string
}

export class FindOneCourseInput implements Input<FindOneCourseInputData> {
    data: FindOneCourseInputData
}

@InputType()
export class FindOneLectureInputParams {
    @Field(() => ID)
        lectureId: string
}

@InputType()
export class FindOneLectureInputOptions {
    @Field(() => ID, { nullable: true })
        followerId?: string
}

@InputType()
export class FindOneLectureInputData implements ParamsWithOptions<FindOneLectureInputParams, FindOneLectureInputOptions> {
    @Field(() => FindOneLectureInputParams)
        params: FindOneLectureInputParams
    @Field(() => FindOneLectureInputOptions, { nullable: true })
        options?: FindOneLectureInputOptions
}

export class FindOneLectureInput implements AuthInput<FindOneLectureInputData> {
    userId: string
    data: FindOneLectureInputData
}

@InputType()
export class FindManyLecturesInputData {
    @Field(() => ID)
        sectionId: string
}

export class FindManyLecturesInput implements Input<FindManyLecturesInputData> {
    data: FindManyLecturesInputData
}

@InputType()
export class CourseFilterInput {
    @Field(() => String, { nullable: true })
        category: string
}

@InputType()
export class FindManyCoursesInputData {
    @Field(() => CourseFilterInput, { nullable: true })
        filter: CourseFilterInput
}

export class FindManyCoursesInput implements Input<FindManyCoursesInputData> {
    data: FindManyCoursesInputData
}

@InputType()
export class FindManyResourcesInputData {
    @Field(() => ID)
        lectureId: string
}

export class FindManyResourcesInput implements AuthInput<FindManyResourcesInputData> {
    userId: string
    data: FindManyResourcesInputData
}

@InputType()
export class FindManyCourseTargetsInputData {
    @Field(() => ID)
        courseId: string
}

export class FindManyCourseTargetsInput implements AuthInput<FindManyCourseTargetsInputData> {
    userId: string
    data: FindManyCourseTargetsInputData
}
