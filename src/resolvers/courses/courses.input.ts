import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { AuthInput, Input, OptionsOnly, ParamsOnly, ParamsWithOptions } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional } from "class-validator"

@InputType()
export class FindOneCourseInputParams {
    @Field(() => ID)
    courseId: string
    @Field(() => ID, { nullable: true })
    userId?: string
}

@InputType()
export class FindOneCourseInputData implements ParamsOnly<FindOneCourseInputParams> {
    @Field(() => FindOneCourseInputParams)
    params: FindOneCourseInputParams
}

export class FindOneCourseInput implements Input<FindOneCourseInputData> {
    data: FindOneCourseInputData
}

@InputType()
export class FindOneCourseAuthInputParams {
    @Field(() => ID)
    courseId: string
}

@InputType()
export class FindOneCourseAuthInputData implements ParamsOnly<FindOneCourseAuthInputParams> {
    @Field(() => FindOneCourseAuthInputParams)
    params: FindOneCourseAuthInputParams
}

export class FindOneCourseAuthInput implements AuthInput<FindOneCourseAuthInputData> {
    userId: string
    data: FindOneCourseAuthInputData
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
export class FindManyLecturesInputParams {
    @Field(() => ID)
    sectionId: string
}

@InputType()
export class FindManyLecturesInputData implements ParamsOnly<FindManyLecturesInputParams> {
    @Field(() => FindManyLecturesInputParams)
    params: FindManyLecturesInputParams
}

export class FindManyLecturesInput implements AuthInput<FindManyLecturesInputData> {
    userId: string
    data: FindManyLecturesInputData
}

@InputType()
export class FindManyCoursesInputOptions {
    @Field(() => Int, { nullable: true })
    take?: number
    @Field(() => Int, { nullable: true })
    skip?: number
    @Field(() => String, { nullable: true })
    searchValue?: string
}

@InputType()
export class FindManyCoursesInputData
    implements
    OptionsOnly<FindManyCoursesInputOptions> {
    @Field(() => FindManyCoursesInputOptions, { nullable: true })
    options?: FindManyCoursesInputOptions
}

export class FindManyCoursesInput implements Input<FindManyCoursesInputData> {
    data: FindManyCoursesInputData
}

@InputType()
export class FindManyResourcesInputParams {
    @Field(() => ID)
    lectureId: string
}

@InputType()
export class FindManyResourcesInputData implements ParamsOnly<FindManyResourcesInputParams> {
    @Field(() => FindManyResourcesInputParams)
    params: FindManyResourcesInputParams
}

export class FindManyResourcesInput implements AuthInput<FindManyResourcesInputData> {
    userId: string
    data: FindManyResourcesInputData
}

@InputType()
export class FindManyCourseTargetsInputParams {
    @Field(() => ID)
    courseId: string
}

@InputType()
export class FindManyCourseTargetsInputData implements ParamsOnly<FindManyCourseTargetsInputParams> {
    @Field(() => FindManyCourseTargetsInputParams)
    params: FindManyCourseTargetsInputParams
}

export class FindManyCourseTargetsInput implements AuthInput<FindManyCourseTargetsInputData> {
    userId: string
    data: FindManyCourseTargetsInputData
}

@InputType()
export class FindOneCourseReviewInputParams {
    @Field(() => ID)
    courseId: string
}

@InputType()
export class FindOneCourseReviewInputData implements ParamsOnly<FindOneCourseReviewInputParams> {
    @Field(() => FindOneCourseReviewInputParams)
    params: FindOneCourseReviewInputParams
}

export class FindOneCourseReviewInput implements Input<FindOneCourseReviewInputData> {
    data: FindOneCourseReviewInputData
}

@InputType()
export class FindManyCourseReviewsInputParams {
    @Field(() => ID)
    courseId: string
}

@InputType()
export class FindManyCourseReviewsInputOptions {
    @Field(() => Int, { nullable: true })
    take?: number
    @Field(() => Int, { nullable: true })
    skip?: number
}

@InputType()
export class FindManyCourseReviewsInputData implements ParamsWithOptions<FindManyCourseReviewsInputParams, FindManyCourseReviewsInputOptions> {
    @Field(() => FindManyCourseReviewsInputParams)
    params: FindManyCourseReviewsInputParams
    @Field(() => FindManyCourseReviewsInputOptions, { nullable: true })
    @IsOptional()
    options?: FindManyCourseReviewsInputOptions
}

export class FindManyCourseReviewsInput implements Input<FindManyCourseReviewsInputData> {
    data: FindManyCourseReviewsInputData
}
