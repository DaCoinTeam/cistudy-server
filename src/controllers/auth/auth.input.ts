import { Input } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsJWT, IsNotEmpty, IsStrongPassword, Length } from "class-validator"

export class SignInInputData {
  @IsEmail()
  @ApiProperty()
  	email: string
    
  @IsStrongPassword()
  @Length(6, 20)
  @ApiProperty()
  	password: string
}

export class SignInInput implements Input<SignInInputData> {
    data: SignInInputData
}

export class SignUpData {
    @IsEmail()
    @ApiProperty({ example: "starci@gmail.com", description: "Email" })
        email: string
  
    @IsStrongPassword()
    @ApiProperty({ example: "Cuong123_A", description: "Password" })
        password: string
  
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
  
export class VerifyGoogleAccessTokenData {
    @IsJWT()
    @ApiProperty()
        token: string
}

export class VerifyGoogleAccessTokenInput implements Input<VerifyGoogleAccessTokenData> {
    @IsJWT()
    @ApiProperty()
        data: VerifyGoogleAccessTokenData
}
  