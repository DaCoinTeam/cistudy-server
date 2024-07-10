import { AuthOutput, AuthTokens, ResultsWithMetadata } from "@common"
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
implements AuthOutput<FindManySelfCreatedCoursesOutputData>
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
implements AuthOutput<FindManyEnrolledCoursesOutputData>
{
  @Field(() => FindManyEnrolledCoursesOutputData)
      data: FindManyEnrolledCoursesOutputData
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class FindManySubmittedReportsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

// @ObjectType()
// export class FindManySubmittedReportsOutputData
// implements ResultsWithMetadata<ReportModel, FindManySubmittedReportsOutputMetadata>
// {
//     @Field(() => [ReportModel])
//         results: Array<ReportModel>
//     @Field(() => FindManySubmittedReportsOutputMetadata, { nullable: true })
//         metadata: FindManySubmittedReportsOutputMetadata
// }

// @ObjectType()
// export class FindManySubmittedReportsOutput implements AuthOutput<FindManySubmittedReportsOutputData> {
//     @Field(() => FindManySubmittedReportsOutputData)
//         data: FindManySubmittedReportsOutputData
//     @Field(() => AuthTokens, { nullable: true })
//         tokens?: AuthTokens
// }
