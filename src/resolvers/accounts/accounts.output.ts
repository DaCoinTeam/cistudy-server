import { AuthTokens, AuthOutput, ResultsWithMetadata } from "@common"
import { AccountMySqlEntity, AccountReviewMySqlEntity, ReportAccountMySqlEntity } from "@database"
import { ObjectType, Int, Field } from "@nestjs/graphql"





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

