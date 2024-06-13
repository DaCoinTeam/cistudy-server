import { AuthTokens, AuthOutput, ResultsWithMetadata } from "@common"
import { LessonMySqlEntity, ResourceMySqlEntity, CourseMySqlEntity, CourseReviewMySqlEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"
import { CategoryEntity } from "src/database/mysql/category.entity"
import { CourseTargetEntity } from "src/database/mysql/course-target.entity"
import { SubcategoryEntity } from "src/database/mysql/subcategory.entity"
import { TopicEntity } from "src/database/mysql/topic.entity"
@ObjectType()
export class FindManyCoursesOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
    @Field(() => [CategoryEntity], { nullable: true })
        categories?: Array<CategoryEntity>
    @Field(() => [SubcategoryEntity], { nullable: true })
        subcategories?: Array<SubcategoryEntity>
    @Field(() => [TopicEntity], { nullable: true })
        topics?: Array<TopicEntity>
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
export class FindManyPostsOutput implements AuthOutput<FindManyCoursesOutputData> {
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
export class FindOneLessonOutput
implements AuthOutput<LessonMySqlEntity>
{
    @Field(() => LessonMySqlEntity)
        data: LessonMySqlEntity
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
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
