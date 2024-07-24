import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { AuthInput, Input, OptionsOnly, ParamsOnly, ParamsWithOptions} from "@common"
import { IsOptional, IsUUID } from "class-validator"

@InputType()
export class FindOneCourseInputParams {
    @Field(() => ID)
        courseId: string
    @Field(() => ID, { nullable: true })
        accountId?: string
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
    @Field(() => ID)
        accountId: string
}

@InputType()
export class FindOneCourseAuthInputData implements ParamsOnly<FindOneCourseAuthInputParams> {
    @Field(() => FindOneCourseAuthInputParams)
        params: FindOneCourseAuthInputParams
}

export class FindOneCourseAuthInput implements AuthInput<FindOneCourseAuthInputData> {
    accountId: string
    data: FindOneCourseAuthInputData
}


@InputType()
export class FindOneSectionContentInputParams {
    @Field(() => ID)
        sectionContentId: string
}

@InputType()
export class FindOneSectionContentInputData implements ParamsOnly<FindOneSectionContentInputParams> {
    @Field(() => FindOneSectionContentInputParams)
        params: FindOneSectionContentInputParams
}

export class FindOneSectionContentInput implements AuthInput<FindOneSectionContentInputData> {
    accountId: string
    data: FindOneSectionContentInputData
}

@InputType()
export class FindManyLessonsInputParams {
    @Field(() => ID)
        sectionId: string
}

@InputType()
export class FindManyLessonsInputData implements ParamsOnly<FindManyLessonsInputParams> {
    @Field(() => FindManyLessonsInputParams)
        params: FindManyLessonsInputParams
}

export class FindManyLessonsInput implements AuthInput<FindManyLessonsInputData> {
    accountId: string
    data: FindManyLessonsInputData
}

@InputType()
export class FindManyCoursesInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
    @Field(() => String, { nullable: true })
        searchValue?: string
    @IsUUID("4")
    @Field(() => [String], { nullable: true })
        categoryIds?: Array<string>
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
        lessonId: string
}

@InputType()
export class FindManyResourcesInputData implements ParamsOnly<FindManyResourcesInputParams> {
    @Field(() => FindManyResourcesInputParams)
        params: FindManyResourcesInputParams
}

export class FindManyResourcesInput implements AuthInput<FindManyResourcesInputData> {
    accountId: string
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
    accountId: string
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

@InputType()
export class FindManyCoursesTopicInputOptions{
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyCoursesTopicInputParams {
    @Field(() => ID)
        topicId: string
}

@InputType()
export class FindManyCoursesTopicInputData implements ParamsWithOptions<FindManyCoursesTopicInputParams, FindManyCoursesTopicInputOptions>{
    @Field(() => FindManyCoursesTopicInputParams)
        params: FindManyCoursesTopicInputParams

    @Field(() => FindManyCoursesTopicInputOptions, { nullable: true })
    @IsOptional()
        options?: FindManyCoursesTopicInputOptions
}

export class FindManyCoursesTopicInput implements Input<FindManyCoursesTopicInputData>{
    data: FindManyCoursesTopicInputData
}

@InputType()
export class FindOneQuizAttemptInputOptions{
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindOneQuizAttemptInputParams {
    @Field(() => String)
        quizAttemptId: string
}

@InputType()
export class FindOneQuizAttemptInputData implements ParamsWithOptions<FindOneQuizAttemptInputParams, FindOneQuizAttemptInputOptions>{
    @Field(() => FindOneQuizAttemptInputParams)
        params: FindOneQuizAttemptInputParams
    @Field(() => FindOneQuizAttemptInputOptions)
        options?: FindOneQuizAttemptInputOptions  
}

export class FindOneQuizAttemptInput implements AuthInput<FindOneQuizAttemptInputData> {
    accountId: string
    data: FindOneQuizAttemptInputData
}

@InputType()
export class FindManyLevelCategoriesInputParams {
    @Field(() => Int, { nullable: true })
        level?: number
}

@InputType()
export class FindManyLevelCategoriesInputData implements ParamsOnly<FindManyLevelCategoriesInputParams>{
    @Field(() => FindManyLevelCategoriesInputParams, {nullable: true})
        params?: FindManyLevelCategoriesInputParams
}

export class FindManyLevelCategoriesInput implements Input<FindManyLevelCategoriesInputData> {
    data: FindManyLevelCategoriesInputData
}

@InputType()
export class FindManyCourseReportsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyCourseReportsInputData implements OptionsOnly<FindManyCourseReportsInputOptions>{
    @Field(() => FindManyCourseReportsInputOptions, { nullable: true })
    @IsOptional()
        options?: FindManyCourseReportsInputOptions
}

export class FindManyCourseReportsInput implements AuthInput<FindManyCourseReportsInputData> {
    accountId: string
    data: FindManyCourseReportsInputData
}