import { AuthTokens, Output, ResultsWithMetadata } from "@common"
import { LectureMySqlEntity, ResourceMySqlEntity, CourseMySqlEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"
import { CourseTargetEntity } from "src/database/mysql/course-target.entity"
@ObjectType()
export class FindManyCoursesOutputMetadata {
  @Field(() => Int, { nullable: true })
      count?: number
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
