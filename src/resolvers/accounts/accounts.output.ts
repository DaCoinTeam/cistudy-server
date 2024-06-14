import { AuthTokens, AuthOutput, ResultsWithMetadata } from "@common"
import { AccountMySqlEntity, UserReviewMySqlEntity } from "@database"
import { ObjectType, Int, Field } from "@nestjs/graphql"

@ObjectType()
export class FindManyUsersOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyUsersOutputData
implements ResultsWithMetadata<AccountMySqlEntity, FindManyUsersOutputMetadata>
{
    @Field(() => [AccountMySqlEntity])
        results: Array<AccountMySqlEntity>
    @Field(() => FindManyUsersOutputMetadata, { nullable: true })
        metadata: FindManyUsersOutputMetadata
}

@ObjectType()
export class FindManyUsersOutput implements AuthOutput<FindManyUsersOutputData> {
    @Field(() => FindManyUsersOutputData)
        data: FindManyUsersOutputData
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