import { AuthTokens, Output, ResultsWithMetadata } from "@common"
import { UserMySqlEntity } from "@database"
import { ObjectType, Int, Field } from "@nestjs/graphql"

@ObjectType()
export class FindManyUsersOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyUsersOutputData
implements ResultsWithMetadata<UserMySqlEntity, FindManyUsersOutputMetadata>
{
    @Field(() => [UserMySqlEntity])
        results: Array<UserMySqlEntity>
    @Field(() => FindManyUsersOutputMetadata, { nullable: true })
        metadata: FindManyUsersOutputMetadata
}

@ObjectType()
export class FindManyUsersOutput implements Output<FindManyUsersOutputData> {
    @Field(() => FindManyUsersOutputData)
        data: FindManyUsersOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}