import { AuthTokens, AuthOutput, ResultsWithMetadata } from "@common"
import { AccountMySqlEntity } from "@database"
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