import { AuthOutput, AuthTokens, ResultsWithMetadata } from "@common"
import { CategoryMySqlEntity, CourseMySqlEntity, CourseReviewMySqlEntity, LessonMySqlEntity, QuizAttemptMySqlEntity, ReportCourseMySqlEntity, ResourceMySqlEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"
import { CategoryEntity } from "src/database/mysql/category.entity"
import { CourseTargetEntity } from "src/database/mysql/course-target.entity"
import { QuizAttemptEntity } from "src/database/mysql/quiz-attempt.entity"
import { SectionContentEntity } from "src/database/mysql/section_content.entity"

@ObjectType()
export class FindManyCoursesOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
    @Field(() => [CategoryEntity], { nullable: true })
        relativeTopics?: Array<CategoryEntity>
}

@ObjectType()
export class FindManyCoursesOutputData
implements ResultsWithMetadata<CourseMySqlEntity, FindManyCoursesOutputMetadata>
{
    @Field(() => [CourseMySqlEntity])
        results: Array<CourseMySqlEntity>
    @Field(() => FindManyCoursesOutputMetadata, { nullable: true })
        metadata: FindManyCoursesOutputMetadata
}

@ObjectType()
export class FindManyCoursesOutput implements AuthOutput<FindManyCoursesOutputData> {
    @Field(() => FindManyCoursesOutputData)
        data: FindManyCoursesOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindOneCourseAuthOutput
implements AuthOutput<CourseMySqlEntity>
{
    @Field(() => CourseMySqlEntity)
        data: CourseMySqlEntity
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindOneSectionContentOutput
implements AuthOutput<SectionContentEntity>
{
    @Field(() => SectionContentEntity)
        data: SectionContentEntity
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}


@ObjectType()
export class FindManyLessonsOutput
implements AuthOutput<Array<LessonMySqlEntity>>
{
    @Field(() => [LessonMySqlEntity])
        data: Array<LessonMySqlEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyResourcesOutput
implements AuthOutput<Array<ResourceMySqlEntity>>
{
    @Field(() => [ResourceMySqlEntity])
        data: Array<ResourceMySqlEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyCourseTargetsOutput
implements AuthOutput<Array<CourseTargetEntity>>
{
    @Field(() => [CourseTargetEntity])
        data: Array<CourseTargetEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

//
@ObjectType()
export class FindManyCourseReviewsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyCourseReviewsOutputData
implements ResultsWithMetadata<CourseReviewMySqlEntity, FindManyCourseReviewsOutputMetadata>
{
    @Field(() => [CourseReviewMySqlEntity])
        results: Array<CourseReviewMySqlEntity>
    @Field(() => FindManyCourseReviewsOutputMetadata, { nullable: true })
        metadata: FindManyCourseReviewsOutputMetadata
}

@ObjectType()
export class FindManyCourseReviewsOutput implements AuthOutput<FindManyCourseReviewsOutputData> {
    @Field(() => FindManyCourseReviewsOutputData)
        data: FindManyCourseReviewsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}
//
@ObjectType()
export class FindManyCoursesTopicOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyCoursesTopicOutputData
implements ResultsWithMetadata<CourseMySqlEntity, FindManyCoursesTopicOutputMetadata>
{
    @Field(() => [CourseMySqlEntity])
        results: Array<CourseMySqlEntity>
    @Field(() => FindManyCoursesTopicOutputMetadata, { nullable: true })
        metadata: FindManyCoursesTopicOutputMetadata
}

@ObjectType()
export class FindManyCoursesTopicOutput implements AuthOutput<FindManyCoursesTopicOutputData> {
    @Field(() => FindManyCoursesTopicOutputData)
        data: FindManyCoursesTopicOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}
//

@ObjectType()
export class FindOneQuizAttemptOutput implements AuthOutput<QuizAttemptMySqlEntity>{
    @Field(() => QuizAttemptEntity)
        data: QuizAttemptMySqlEntity
    @Field(() => AuthTokens, {nullable: true})
        tokens?: AuthTokens
    @Field(() => Int, {nullable: true})
        numberOfQuestions? : number
}

@ObjectType()
export class FindOneCategoryOutput implements AuthOutput<CategoryMySqlEntity>{
    @Field(() => CategoryMySqlEntity)
        data: CategoryMySqlEntity
    tokens?: AuthTokens
}

@ObjectType()
export class FindManyCourseReportsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyCourseReportsOutputData
implements ResultsWithMetadata<ReportCourseMySqlEntity, FindManyCourseReportsOutputMetadata>
{
    @Field(() => [ReportCourseMySqlEntity])
        results: Array<ReportCourseMySqlEntity>
    @Field(() => FindManyCourseReportsOutputMetadata, { nullable: true })
        metadata: FindManyCourseReportsOutputMetadata
}

@ObjectType()
export class FindManyCourseReportsOutput implements AuthOutput<FindManyCourseReportsOutputData> {
    @Field(() => FindManyCourseReportsOutputData)
        data: FindManyCourseReportsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}
//
@ObjectType()
export class FindManyQuizAttemptsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyQuizAttemptsOutputData
implements ResultsWithMetadata<QuizAttemptMySqlEntity, FindManyQuizAttemptsOutputMetadata>
{
    @Field(() => [QuizAttemptMySqlEntity])
        results: Array<QuizAttemptMySqlEntity>
    @Field(() => FindManyQuizAttemptsOutputMetadata, { nullable: true })
        metadata: FindManyQuizAttemptsOutputMetadata
}

@ObjectType()
export class FindManyQuizAttemptsOutput implements AuthOutput<FindManyQuizAttemptsOutputData> {
    @Field(() => FindManyQuizAttemptsOutputData)
        data: FindManyQuizAttemptsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}
