import { Field, ObjectType } from "@nestjs/graphql"
import { UserRole } from "./entities.types"
import { IsJWT } from "class-validator"

@ObjectType()
export class AuthTokens {
  @IsJWT()
  @Field(() => String)
      accessToken: string
  @IsJWT()
  @Field(() => String)
      refreshToken: string
}

export enum TokenType {
  Access = "Access",
  Refresh = "Refresh",
  Verify = "Verify",
}

export enum AuthTokenType {
  Access = "Access",
  Refresh = "Refresh",
}

export type Payload = {
  userId: string;
  userRole?: UserRole;
  type: AuthTokenType;
  iat: string;
  exp: string;
};
