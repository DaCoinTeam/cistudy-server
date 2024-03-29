import { Output, AuthTokens, ResultsWithMetadata } from "@common"
import { CourseMySqlEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindManySelfCreatedCoursesOutputMetadata {
  @Field(() => Int, { nullable: true })
      count: number
}

@ObjectType()
export class FindManySelfCreatedCoursesOutputData
{
  @Field(() => [CourseMySqlEntity])
      results: Array<CourseMySqlEntity>
  @Field(() => FindManySelfCreatedCoursesOutputMetadata, { nullable: true })
      metadata: FindManySelfCreatedCoursesOutputMetadata
}

@ObjectType()
export class FindManySelfCreatedCoursesOutput
implements Output<FindManySelfCreatedCoursesOutputData>
{
  @Field(() => FindManySelfCreatedCoursesOutputData)
      data: FindManySelfCreatedCoursesOutputData
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class FindManyEnrolledCoursesOutputMetadata {
  @Field(() => Int, { nullable: true })
      count?: number
}

@ObjectType()
export class FindManyEnrolledCoursesOutputData
implements ResultsWithMetadata<CourseMySqlEntity, FindManyEnrolledCoursesOutputMetadata>
{
  @Field(() => [CourseMySqlEntity])
      results: Array<CourseMySqlEntity>
  @Field(() => FindManyEnrolledCoursesOutputMetadata, { nullable: true })
      metadata: FindManyEnrolledCoursesOutputMetadata
}

@ObjectType()
export class FindManyEnrolledCoursesOutput
implements Output<FindManyEnrolledCoursesOutputData>
{
  @Field(() => FindManyEnrolledCoursesOutputData)
      data: FindManyEnrolledCoursesOutputData
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}
