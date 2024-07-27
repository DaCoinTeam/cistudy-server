import { AuthOutput, AuthTokens, AuthTokenType, Payload } from "@common"
import { jwtConfig } from "@config"
import { AccountMySqlEntity, RoleMySqlEntity, SessionMySqlEntity } from "@database"
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { JsonWebTokenError, JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class AuthManagerService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(SessionMySqlEntity)
        private readonly sessionMySqlRepository: Repository<SessionMySqlEntity>,
        @InjectRepository(RoleMySqlEntity)
        private readonly roleMySqlRepository: Repository<RoleMySqlEntity>,
    ) { }

    async verifyToken(token: string): Promise<Payload> {
        try {
            return await this.jwtService.verifyAsync<Payload>(token, {
                secret: jwtConfig().secret
            })
        } catch (ex) {
            if (ex instanceof JsonWebTokenError) {
                throw new UnauthorizedException("Invalid token.")
            }
        }
    }

    async validateSession(accountId: string, clientId: string): Promise<void> {
        if (!clientId) throw new NotFoundException("Client id not found.")
        const session = await this.sessionMySqlRepository.findOneBy({
            accountId,
            clientId,
        })
        if (session === null) throw new UnauthorizedException("Session not found.")
        if (session.isDisabled)
            throw new UnauthorizedException("Session is disabled.")
    }

    async generateToken<T extends PayloadLike>(
        data: T,
        type: AuthTokenType,
    ) {
        const typeToExpiresIn: Record<AuthTokenType, string> = {
            [AuthTokenType.Access]: jwtConfig().accessTokenExpiryTime,
            [AuthTokenType.Refresh]: jwtConfig().refreshTokenExpiryTime,
        }
        const expiresIn = typeToExpiresIn[type]

        const payload: PayloadLike = {
            accountId: data.accountId,
            accountRoles: (type === AuthTokenType.Access) ? data.accountRoles : undefined,
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
        
        const accessToken = await this.generateToken(data, AuthTokenType.Access)
        const refreshToken = await this.generateToken(data, AuthTokenType.Refresh)
        if (clientId) {
            let found = await this.sessionMySqlRepository.findOneBy({
                clientId,
                accountId: data.accountId,
            })
            if (!found) {
                found = await this.sessionMySqlRepository.save({
                    clientId,
                    accountId: data.accountId,
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
        authTokensRequested: boolean,
        clientId?: string,
    ): Promise<AuthOutput<T>> {
        const { accountId } = payload
        let { accountRoles } = payload
        
        if (authTokensRequested) {
            const roles = await this.roleMySqlRepository.find({
                where:{
                    accountId
                }
            })
            accountRoles = roles ? roles
                .filter(accountRole => accountRole.isDisabled === false)
                .map(accountRole => accountRole.name)
                : undefined
        }

        const tokens = authTokensRequested
            ? await this.generateAuthTokens({ accountId, accountRoles }, clientId)
            : undefined

        return {
            data,
            tokens,
        }
    }

}

export interface PayloadLike {
    accountId: string,
    accountRoles: Array<string>,
    type?: AuthTokenType
}