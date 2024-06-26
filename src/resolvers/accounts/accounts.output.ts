import { AuthTokens, AuthOutput, ResultsWithMetadata } from "@common"
import { AccountMySqlEntity, AccountReviewMySqlEntity, CourseMySqlEntity } from "@database"
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
//
// @ObjectType()
// export class FindManySelfCreatedCoursesOutputMetadata {
//     @Field(() => Int, { nullable: true })
//         count?: number
// }

// @ObjectType()
// export class FindManySelfCreatedCoursesOutputData
// implements ResultsWithMetadata<CourseMySqlEntity, FindManySelfCreatedCoursesOutputMetadata>
// {
//     @Field(() => [CourseMySqlEntity])
//         results: Array<CourseMySqlEntity>
//     @Field(() => FindManySelfCreatedCoursesOutputMetadata, { nullable: true })
//         metadata: FindManySelfCreatedCoursesOutputMetadata
// }

// @ObjectType()
// export class FindManySelfCreatedCoursesOutput implements AuthOutput<FindManySelfCreatedCoursesOutputData> {
//     @Field(() => FindManySelfCreatedCoursesOutputData)
//         data: FindManySelfCreatedCoursesOutputData
//     @Field(() => AuthTokens, { nullable: true })
//         tokens?: AuthTokens
// }