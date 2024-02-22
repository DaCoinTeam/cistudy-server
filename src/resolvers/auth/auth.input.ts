import { AuthEmptyDataInput, Input } from "@common"
import { Field, ID, InputType } from "@nestjs/graphql"
import { IsEmail, Length } from "class-validator"

@InputType()
export class InitInput implements AuthEmptyDataInput {
    @Field(() => ID)
        userId: string
}

@InputType()
export class SignInData {
    @Field(() => String)
    @IsEmail()
        email: string

    @Field(() => String)
    @Length(6, 20)
        password: string
}

export class SignInInput implements Input<SignInData> {
    data: SignInData
}

