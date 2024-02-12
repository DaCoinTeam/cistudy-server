import { UserRole } from "./entities.definition"

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

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
