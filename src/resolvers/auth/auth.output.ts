import { AuthOutput, AuthTokens } from "@common"
import { AccountMySqlEntity } from "@database"
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class InitOutput
implements AuthOutput<AccountMySqlEntity>
{
  @Field(() => AccountMySqlEntity)
      data: AccountMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class SignInOutput
implements AuthOutput<AccountMySqlEntity>
{
//   @Field(() => AccountMySqlEntity)
//       data: AccountMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class VerifyGoogleAccessTokenOutput
implements AuthOutput<AccountMySqlEntity>
{
  @Field(() => AccountMySqlEntity)
      data: AccountMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}
