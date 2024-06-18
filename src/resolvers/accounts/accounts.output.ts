import { AuthTokens, AuthOutput, ResultsWithMetadata } from "@common"
import { AccountMySqlEntity, UserReviewMySqlEntity } from "@database"
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
export class FindManyUserReviewsOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyUserReviewsOutputData
implements ResultsWithMetadata<UserReviewMySqlEntity, FindManyUserReviewsOutputMetadata>
{
    @Field(() => [UserReviewMySqlEntity])
        results: Array<UserReviewMySqlEntity>
    @Field(() => FindManyUserReviewsOutputMetadata, { nullable: true })
        metadata: FindManyUserReviewsOutputMetadata
}

@ObjectType()
export class FindManyUserReviewsOutput implements AuthOutput<FindManyUserReviewsOutputData> {
    @Field(() => FindManyUserReviewsOutputData)
        data: FindManyUserReviewsOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}