import { UserMySqlEntity } from "@database"
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
import { UserKind } from "@common"

@Injectable()
export class AuthService {
    constructor(
    private readonly sha256Service: Sha256Service,
    @InjectRepository(UserMySqlEntity)
    private readonly userMySqlRepository: Repository<UserMySqlEntity>,
    private readonly firebaseService: FirebaseService,
    ) {}

    async init(input: InitInput): Promise<UserMySqlEntity> {
        return await this.userMySqlRepository.findOneBy(input)
    }

    async signIn(input: SignInInput): Promise<UserMySqlEntity> {
        const { data } = input
        const { email, password } = data
        const found = await this.userMySqlRepository.findOneBy({
            email,
        })
        if (!found) throw new NotFoundException("User not found.")
        if (!this.sha256Service.verifyHash(password, found.password))
            throw new UnauthorizedException("Invalid credentials.")
        return found
    }

    async verifyGoogleAccessToken(
        input: VerifyGoogleAccessTokenInput,
    ): Promise<UserMySqlEntity> {
        const { data } = input
        const { params } = data
        const { token } = params

        const decoded = await this.firebaseService.verifyGoogleAccessToken(token)
        if (!decoded)
            throw new UnauthorizedException("Invalid Google access token.")
        let found = await this.userMySqlRepository.findOneBy({
            externalId: decoded.uid,
        })
        if (!found) {
            found = await this.userMySqlRepository.save({
                externalId: decoded.uid,
                email: decoded.email,
                phoneNumber: decoded.phone_number,
                avatarUrl: decoded.picture,
                kind: UserKind.Google,
            })
        }
        return found
    }
}
