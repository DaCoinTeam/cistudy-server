import { Output, AuthTokens } from "@common"
import { UserMySqlEntity } from "@database"
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class InitOutput
implements Output<UserMySqlEntity>
{
  @Field(() => UserMySqlEntity)
      data: UserMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class SignInOutput
implements Output<UserMySqlEntity>
{
  @Field(() => UserMySqlEntity)
      data: UserMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}
