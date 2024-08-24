import { Input } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsNotEmpty, IsStrongPassword, Length } from "class-validator"

export class SignInInputData {
  @IsEmail()
  @ApiProperty()
  	email: string

  @Length(6, 20)
  @ApiProperty()
  	password: string
}

export class SignInInput implements Input<SignInInputData> {
    data: SignInInputData
}

export class SignUpData {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: "starci@gmail.com", description: "Email" })
        email: string

    @IsStrongPassword()
    @ApiProperty({ example: "Cuong123_A", description: "Password" })
        password: string
        
    @IsNotEmpty()
    @ApiProperty({ example: "sample123", description: "User's Name" })
        username: string

    @IsNotEmpty()
    @ApiProperty({ example: "Nguyen Van Tu", description: "First Name" })
        firstName: string
  
    @IsNotEmpty()
    @ApiProperty({ example: "Cuong", description: "Last Name" })
        lastName: string
  
    @IsDateString()
    @ApiProperty({ example: "2002-03-18", description: "Birthdate" })
        birthdate: Date
}
  
export class SignUpInput implements Input<SignUpData> {
    data: SignUpData
}

export class VerifyRegistrationInputData{
    @ApiProperty()
        token : string
}

export class VerifyRegistrationInput implements Input<VerifyRegistrationInputData> {
    data: VerifyRegistrationInputData
}

export class ResetPasswordInputData{
    @ApiProperty()
        token : string
}

export class ResetPasswordInput implements Input<ResetPasswordInputData> {
    data: ResetPasswordInputData
}

export class ForgotPasswordInputData {
    @ApiProperty()
        email: string
}

export class ForgotPasswordInput implements Input<ForgotPasswordInputData> {
    data: ForgotPasswordInputData
}

