import { AuthOutput, AuthTokens, Output } from "@common"
import { AccountMySqlEntity, CourseMySqlEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"

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

@ObjectType()
export class InitLandingPageOutputOthers {
    @Field(() => Int, { nullable: true })
        totalNumberOfVerifiedAccounts? : number
    @Field(() => Int, { nullable: true })
        totalNumberOfAvailableCourses? : number
    @Field(() => Int, { nullable: true })
        totalNumberOfPosts? : number
    @Field(() => [CourseMySqlEntity], { nullable: true })
        highRatedCourses? : Array<CourseMySqlEntity>
    @Field(() => [AccountMySqlEntity], { nullable: true })
        highRatedInstructors? : Array<AccountMySqlEntity>
    @Field(() => [CourseMySqlEntity], { nullable: true })
        recentlyAddedCourses? : Array<CourseMySqlEntity>
}

export class InitLandingPageOutput implements Output<InitLandingPageOutputOthers>{
    message: string
    others?: InitLandingPageOutputOthers
}
