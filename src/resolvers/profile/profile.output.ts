import { AuthOutput, AuthTokens, ResultsWithMetadata } from "@common"
import {
    CourseMySqlEntity,
    NotificationMySqlEntity,
    OrderMySqlEntity,
    PostMySqlEntity,
    TransactionMySqlEntity,
} from "@database"
import { Field, Float, Int, ObjectType } from "@nestjs/graphql"

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

@ObjectType()
export class FindManyReceivedNotificationsOutputMetadata {
  @Field(() => Int, { nullable: true })
      count?: number
  @Field(() => Int, { nullable: true })
      notViewedCount?: number
}

@ObjectType()
export class FindManyReceivedNotificationsOutputData
implements
    ResultsWithMetadata<
      NotificationMySqlEntity,
      FindManyReceivedNotificationsOutputMetadata
    >
{
  @Field(() => [NotificationMySqlEntity])
      results: Array<NotificationMySqlEntity>
  @Field(() => FindManyReceivedNotificationsOutputMetadata, { nullable: true })
      metadata: FindManyReceivedNotificationsOutputMetadata
}

@ObjectType()
export class FindManyReceivedNotificationsOutput
implements AuthOutput<FindManyReceivedNotificationsOutputData>
{
  @Field(() => FindManyReceivedNotificationsOutputData)
      data: FindManyReceivedNotificationsOutputData
  @Field(() => AuthTokens, { nullable: true })
      tokens?: AuthTokens
}

// @ObjectType()
// export class FindOneCertificateOutput implements AuthOutput<CertificateMySqlEntity>{
//     @Field(() => CertificateMySqlEntity)
//         data?: CertificateMySqlEntity
//     @Field(() => AuthTokens, { nullable: true })
//         tokens?: AuthTokens
// }

@ObjectType()
export class FindManyAccountOrdersOutputMetadata {
  @Field(() => Int, { nullable: true })
      count?: number
}

@ObjectType()
export class FindManyAccountOrdersOutputData
implements
    ResultsWithMetadata<OrderMySqlEntity, FindManyAccountOrdersOutputMetadata>
{
  @Field(() => [OrderMySqlEntity])
      results: Array<OrderMySqlEntity>
  @Field(() => FindManyAccountOrdersOutputMetadata, { nullable: true })
      metadata: FindManyAccountOrdersOutputMetadata
}

@ObjectType()
export class FindManyAccountOrdersOutput
implements AuthOutput<FindManyAccountOrdersOutputData>
{
  @Field(() => FindManyAccountOrdersOutputData)
      data: FindManyAccountOrdersOutputData
  @Field(() => AuthTokens, { nullable: true })
      tokens?: AuthTokens
}

@ObjectType()
export class GetCourseStatisticOutputData {
  @Field(() => Int, { nullable: true })
      numberOfRewardablePostsLeft?: number
  @Field(() => Float, { nullable: true })
      totalEarning?: number
  @Field(() => Float, { nullable: true })
      pendingEarning?: number
  @Field(() => [PostMySqlEntity], { nullable: true })
      likePosts?: Array<PostMySqlEntity>
  @Field(() => [PostMySqlEntity], { nullable: true })
      commentPosts?: Array<PostMySqlEntity>
  @Field(() => [PostMySqlEntity], { nullable: true })
      markedPosts?: Array<PostMySqlEntity>
  @Field(() => [PostMySqlEntity], { nullable: true })
      createdPosts?: Array<PostMySqlEntity>
}

@ObjectType()
export class GetCourseStatisticOutput
implements AuthOutput<GetCourseStatisticOutputData>
{
  @Field(() => GetCourseStatisticOutputData)
      data: GetCourseStatisticOutputData
  @Field(() => AuthTokens, { nullable: true })
      tokens?: AuthTokens
}
