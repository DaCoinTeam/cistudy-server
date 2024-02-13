import { Output, AuthTokens } from "@common"
import { UserMySqlEntity } from "@database"
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindProfileByAuthTokenOutput
implements Output<UserMySqlEntity>
{
  @Field(() => UserMySqlEntity)
      data: UserMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}
