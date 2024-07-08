import { AuthTokens, AuthOutput, ResultsWithMetadata } from "@common"
import { AccountMySqlEntity, AccountReviewMySqlEntity } from "@database"
import { ObjectType, Int, Field } from "@nestjs/graphql"
import { ReportModel } from "src/database/dto/report.dto"




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
export class FindManyReportsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyReportsOutputData
implements ResultsWithMetadata<ReportModel, FindManyReportsOutputMetadata>
{
    @Field(() => [ReportModel])
        results: Array<ReportModel>
    @Field(() => FindManyReportsOutputMetadata, { nullable: true })
        metadata: FindManyReportsOutputMetadata
}

@ObjectType()
export class FindManyReportsOutput implements AuthOutput<FindManyReportsOutputData> {
    @Field(() => FindManyReportsOutputData)
        data: FindManyReportsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}

