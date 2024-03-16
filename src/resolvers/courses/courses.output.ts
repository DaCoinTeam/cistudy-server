import { AuthTokens, Output, ResultsWithMetadata } from "@common"
import { LectureMySqlEntity, ResourceMySqlEntity, CourseMySqlEntity } from "@database"
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
export class FindManyPostsOutput implements Output<FindManyCoursesOutputData> {
    @Field(() => FindManyCoursesOutputData)
        data: FindManyCoursesOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}


@ObjectType()
export class FindOneLectureOutput
implements Output<LectureMySqlEntity>
{
    @Field(() => LectureMySqlEntity)
        data: LectureMySqlEntity
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}


@ObjectType()
export class FindManyLecturesOutput
implements Output<Array<LectureMySqlEntity>>
{
    @Field(() => [LectureMySqlEntity])
        data: Array<LectureMySqlEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyResourcesOutput
implements Output<Array<ResourceMySqlEntity>>
{
    @Field(() => [ResourceMySqlEntity])
        data: Array<ResourceMySqlEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyCourseTargetsOutput
implements Output<Array<CourseTargetEntity>>
{
    @Field(() => [CourseTargetEntity])
        data: Array<CourseTargetEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}
