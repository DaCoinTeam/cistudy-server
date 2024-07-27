import { AuthOutput, AuthTokens, ResultsWithMetadata } from "@common"
import { CourseMySqlEntity, TransactionMySqlEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindManySelfCreatedCoursesOutputMetadata {
  @Field(() => Int, { nullable: true })
      count: number
}

@ObjectType()
export class FindManySelfCreatedCoursesOutputData {
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
implements
    ResultsWithMetadata<
      CourseMySqlEntity,
      FindManyEnrolledCoursesOutputMetadata
    >
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

@ObjectType()
export class FindManyTransactionsMetadata {
  @Field(() => Int, { nullable: true })
      count?: number
}

@ObjectType()
export class FindManyTransactionsOutputData
implements
    ResultsWithMetadata<TransactionMySqlEntity, FindManyTransactionsMetadata>
{
  @Field(() => [TransactionMySqlEntity])
      results: Array<TransactionMySqlEntity>
  @Field(() => FindManyTransactionsMetadata, { nullable: true })
      metadata: FindManyTransactionsMetadata
}

@ObjectType()
export class FindManyTransactionsOutput
implements AuthOutput<FindManyTransactionsOutputData>
{
  @Field(() => FindManyTransactionsOutputData)
      data: FindManyTransactionsOutputData
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}
