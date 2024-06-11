import { AuthOutput, AuthTokens } from "@common"
import { UserMySqlEntity } from "@database"
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class InitOutput
implements AuthOutput<UserMySqlEntity>
{
  @Field(() => UserMySqlEntity)
      data: UserMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class SignInOutput
implements AuthOutput<UserMySqlEntity>
{
  @Field(() => UserMySqlEntity)
      data: UserMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class VerifyGoogleAccessTokenOutput
implements AuthOutput<UserMySqlEntity>
{
  @Field(() => UserMySqlEntity)
      data: UserMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}
