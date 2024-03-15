import { AuthEmptyDataInput, Input, ParamsOnly } from "@common"
import { Field, ID, InputType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsJWT, Length } from "class-validator"

@InputType()
export class InitInput implements AuthEmptyDataInput {
  @Field(() => ID)
      userId: string
}

@InputType()
export class SignInInputData {
  @Field(() => String)
  @IsEmail()
      email: string

  @Field(() => String)
  @Length(6, 20)
      password: string
}

export class SignInInput implements Input<SignInInputData> {
    data: SignInInputData
}

@InputType()
export class VerifyGoogleAccessTokenParams {
  @IsJWT()
  @Field(() => ID)
  @ApiProperty()
      token: string
}

@InputType()
export class VerifyGoogleAccessTokenData
implements ParamsOnly<VerifyGoogleAccessTokenParams>
{
  @Field(() => VerifyGoogleAccessTokenParams)
  @ApiProperty()
      params: VerifyGoogleAccessTokenParams
}

export class VerifyGoogleAccessTokenInput
implements Input<VerifyGoogleAccessTokenData>
{
    data: VerifyGoogleAccessTokenData
}
