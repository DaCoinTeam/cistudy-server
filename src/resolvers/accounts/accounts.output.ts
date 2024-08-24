import { AuthOutput, AuthTokens, ResultsWithMetadata } from "@common"
import { AccountMySqlEntity, AccountReviewMySqlEntity, ConfigurationMySqlEntity, CourseMySqlEntity, EnrolledInfoMySqlEntity, NotificationMySqlEntity, ReportAccountMySqlEntity, TransactionMySqlEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindManyAccountsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyAccountsOutputData
implements ResultsWithMetadata<AccountMySqlEntity, FindManyAccountsOutputMetadata>
{
    @Field(() => [AccountMySqlEntity])
        results: Array<AccountMySqlEntity>
    @Field(() => FindManyAccountsOutputMetadata, { nullable: true })
        metadata: FindManyAccountsOutputMetadata
}

@ObjectType()
export class FindManyAccountsOutput implements AuthOutput<FindManyAccountsOutputData> {
    @Field(() => FindManyAccountsOutputData)
        data: FindManyAccountsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyAccountReviewsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyAccountReviewsOutputData
implements ResultsWithMetadata<AccountReviewMySqlEntity, FindManyAccountReviewsOutputMetadata>
{
    @Field(() => [AccountReviewMySqlEntity])
        results: Array<AccountReviewMySqlEntity>
    @Field(() => FindManyAccountReviewsOutputMetadata, { nullable: true })
        metadata: FindManyAccountReviewsOutputMetadata
}

@ObjectType()
export class FindManyAccountReviewsOutput implements AuthOutput<FindManyAccountReviewsOutputData> {
    @Field(() => FindManyAccountReviewsOutputData)
        data: FindManyAccountReviewsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}

@ObjectType()
export class FindManyAccountReportsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyAccountReportsOutputData
implements ResultsWithMetadata<ReportAccountMySqlEntity, FindManyAccountReportsOutputMetadata>
{
    @Field(() => [ReportAccountMySqlEntity])
        results: Array<ReportAccountMySqlEntity>
    @Field(() => FindManyAccountReportsOutputMetadata, { nullable: true })
        metadata: FindManyAccountReportsOutputMetadata
}

@ObjectType()
export class FindManyAccountReportsOutput implements AuthOutput<FindManyAccountReportsOutputData> {
    @Field(() => FindManyAccountReportsOutputData)
        data: FindManyAccountReportsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}

@ObjectType()
export class FindManyPublishedCoursesOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyPublishedCoursesOutputData implements ResultsWithMetadata<CourseMySqlEntity, FindManyPublishedCoursesOutputMetadata>{
    @Field(() => [CourseMySqlEntity])
        results: Array<CourseMySqlEntity>
    @Field(() => FindManyPublishedCoursesOutputMetadata)
        metadata?: FindManyPublishedCoursesOutputMetadata
}

@ObjectType()
export class FindManyPublishedCoursesOutput implements AuthOutput<FindManyPublishedCoursesOutputData> {
    @Field(() => FindManyPublishedCoursesOutputData)
        data: FindManyPublishedCoursesOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}

@ObjectType()
export class FindManyAdminTransactionsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyAdminTransactionsOutputData
implements ResultsWithMetadata<TransactionMySqlEntity, FindManyAdminTransactionsOutputMetadata>
{
    @Field(() => [TransactionMySqlEntity])
        results: Array<TransactionMySqlEntity>
    @Field(() => FindManyAdminTransactionsOutputMetadata, { nullable: true })
        metadata: FindManyAdminTransactionsOutputMetadata
}

@ObjectType()
export class FindManyAdminTransactionsOutput implements AuthOutput<FindManyAdminTransactionsOutputData> {
    @Field(() => FindManyAdminTransactionsOutputData)
        data: FindManyAdminTransactionsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyNotificationsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyNotificationsOutputData
implements ResultsWithMetadata<NotificationMySqlEntity, FindManyNotificationsOutputMetadata>
{
    @Field(() => [NotificationMySqlEntity])
        results: Array<NotificationMySqlEntity>
    @Field(() => FindManyNotificationsOutputMetadata, { nullable: true })
        metadata: FindManyNotificationsOutputMetadata
}

@ObjectType()
export class FindManyNotificationsOutput implements AuthOutput<FindManyNotificationsOutputData> {
    @Field(() => FindManyNotificationsOutputData)
        data: FindManyNotificationsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}


@ObjectType()
export class GetAdminAnalyticsOutputData {
    @Field(() => Int)
        numberOfAccounts: number
    @Field(() => Int)
        numberOfCourses: number
    @Field(() => Int)
        numberOfTransactions: number
    @Field(() => Int)
        numberOfOrders: number
    @Field(() => [EnrolledInfoMySqlEntity])
        enrolledInfos: Array<EnrolledInfoMySqlEntity>
}

@ObjectType()
export class GetAdminAnalyticsOutput implements AuthOutput<GetAdminAnalyticsOutputData> {
    @Field(() => GetAdminAnalyticsOutputData)
        data: GetAdminAnalyticsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}

@ObjectType()
export class FindLatestConfigurationOutput implements AuthOutput<ConfigurationMySqlEntity> {
    @Field(() => ConfigurationMySqlEntity, { nullable: true })
        data: ConfigurationMySqlEntity
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}

@ObjectType()
export class FindOneAdminAccountOutput implements AuthOutput<AccountMySqlEntity> {
    @Field(() => AccountMySqlEntity, { nullable: true })
        data: AccountMySqlEntity
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}

@ObjectType()
export class FindManyPendingInstructorOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyPendingInstructorOutputData implements ResultsWithMetadata<AccountMySqlEntity, FindManyPendingInstructorOutputMetadata>{
    @Field(() => [AccountMySqlEntity])
        results: Array<AccountMySqlEntity>
    @Field(() => FindManyPendingInstructorOutputMetadata)
        metadata?: FindManyPendingInstructorOutputMetadata
}

@ObjectType()
export class FindManyPendingInstructorOutput implements AuthOutput<FindManyPendingInstructorOutputData> {
    @Field(() => FindManyPendingInstructorOutputData)
        data: FindManyPendingInstructorOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}