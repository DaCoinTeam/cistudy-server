import { jwtConfig } from "@config"
import { SessionMySqlEntity, UserMySqlEntity } from "@database"
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { JsonWebTokenError, JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Payload, AuthTokens, AuthTokenType, Output, UserRole } from "@common"
import { Repository } from "typeorm"

@Injectable()
export class AuthManagerService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserMySqlEntity)
        private readonly userMySqlRepository: Repository<UserMySqlEntity>,
        @InjectRepository(SessionMySqlEntity)
        private readonly sessionMySqlRepository: Repository<SessionMySqlEntity>,
    ) { }

    async verifyToken(token: string): Promise<Payload> {
        try {
            return await this.jwtService.verifyAsync<Payload>(token)
        } catch (ex) {
            if (ex instanceof JsonWebTokenError) {
                throw new UnauthorizedException("Invalid token.")
            }
        }
    }

    async validateSession(userId: string, clientId: string): Promise<void> {
        if (!clientId) throw new NotFoundException("Client id not found.")
        const session = await this.sessionMySqlRepository.findOneBy({
            userId,
            clientId,
        })
        if (session === null) throw new UnauthorizedException("Session not found.")
        if (session.isDisabled)
            throw new UnauthorizedException("Session is disabled.")
    }

    async generateToken<T extends PayloadLike>(
        data: T,
        type: AuthTokenType = AuthTokenType.Access,
    ) {
        const typeToExpiresIn: Record<AuthTokenType, string> = {
            [AuthTokenType.Access]: jwtConfig().accessTokenExpiryTime,
            [AuthTokenType.Refresh]: jwtConfig().refreshTokenExpiryTime,
        }
        const expiresIn = typeToExpiresIn[type]

        console.log(data.userRole)

        const payload: PayloadLike = {
            userId: data.userId,
            userRole: type === AuthTokenType.Access ? data.userRole : undefined,
            type,
        }

        return await this.jwtService.signAsync(payload, {
            expiresIn,
            secret: jwtConfig().secret,
        })
    }

    async generateAuthTokens<T extends PayloadLike>(
        data: T,
        clientId?: string,
    ): Promise<AuthTokens> {
        const accessToken = await this.generateToken(data)
        const refreshToken = await this.generateToken(data, AuthTokenType.Refresh)
        if (clientId) {
            let found = await this.sessionMySqlRepository.findOneBy({
                clientId,
                userId: data.userId,
            })
            if (!found) {
                found = await this.sessionMySqlRepository.save({
                    clientId,
                    userId: data.userId,
                })
            } else {
                const { sessionId, numberOfUpdates } = found
                    
                await this.sessionMySqlRepository.update({
                    sessionId,
                }, { numberOfUpdates: numberOfUpdates + 1 })
            }
        }

        return {
            accessToken,
            refreshToken,
        }
    }

    async generateOutput<T extends object>(
        payload: PayloadLike,
        data: T,
        authTokensRequested: boolean = false,
        clientId?: string,
    ): Promise<Output<T>> {
        const { userId } = payload
        let { userRole } = payload

        if (authTokensRequested) {
            const user = await this.userMySqlRepository.findOneBy({ userId })
            userRole = user.userRole
        }

        const tokens = authTokensRequested
            ? await this.generateAuthTokens({ userId, userRole }, clientId)
            : undefined

        return {
            data,
            tokens,
        }
    }
}

export interface PayloadLike {
    userId: string,
    userRole: UserRole,
    type?: AuthTokenType
}