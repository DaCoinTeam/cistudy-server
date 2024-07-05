import { AccountMySqlEntity, RoleMySqlEntity } from "@database"
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import {
    InitInput,
    SignInInput,
    VerifyGoogleAccessTokenInput,
} from "./auth.input"
import { FirebaseService, Sha256Service } from "@global"
import { AccountKind, SystemRoles } from "@common"

@Injectable()
export class AuthService {
    constructor(
        private readonly sha256Service: Sha256Service,
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(RoleMySqlEntity)
        private readonly roleMySqlRepository: Repository<RoleMySqlEntity>,
        private readonly firebaseService: FirebaseService,
    ) { }

    async init(input: InitInput): Promise<AccountMySqlEntity> {
        const account = await this.accountMySqlRepository.findOne({
            where: {
                accountId: input.accountId,
            },
            relations: {
                cart: {
                    cartCourses: {
                        course: true
                    }
                },
                roles: true
            }
        })
        return account
    }

    async signIn(input: SignInInput): Promise<AccountMySqlEntity> {
        const { data } = input
        const { params } = data
        const { email, password } = params

        const found = await this.accountMySqlRepository.findOneBy({
            email,
        })
        if (!found) throw new NotFoundException("Account not found.")
        if (!this.sha256Service.verifyHash(password, found.password))
            throw new UnauthorizedException("Invalid credentials.")
        if (found.verified === false) {
            throw new UnauthorizedException("Your account is not verified, please check the email again")
        }
        return found
    }

    async verifyGoogleAccessToken(
        input: VerifyGoogleAccessTokenInput
    ): Promise<AccountMySqlEntity> {
        const { data } = input
        const { params } = data
        const { token } = params

        const decoded = await this.firebaseService.verifyGoogleAccessToken(token)
        if (!decoded)
            throw new UnauthorizedException("Invalid Google access token.")
        let found = await this.accountMySqlRepository.findOneBy({
            externalId: decoded.uid,
        })

        if (!found) {
            found = await this.accountMySqlRepository.save({
                externalId: decoded.uid,
                email: decoded.email,
                phoneNumber: decoded.phone_number,
                avatarUrl: decoded.picture,
                kind: AccountKind.Google,
                verified: true,
            })
            await this.roleMySqlRepository.save({
                accountId: found.accountId,
                name: SystemRoles.User
            })
        }
        return found
    }
}
