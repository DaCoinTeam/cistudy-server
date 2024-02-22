import { UserMySqlEntity } from "@database"
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { InitInput, SignInInput } from "./auth.input"
import { Sha256Service } from "@global"
@Injectable()
export class AuthService {
    constructor(
        private readonly sha256Service: Sha256Service,
        @InjectRepository(UserMySqlEntity)
        private readonly userMySqlRepository: Repository<UserMySqlEntity>,
    ) { }

    async init(
        input: InitInput,
    ): Promise<UserMySqlEntity> {
        return await this.userMySqlRepository.findOneBy(input)
    }

    async signIn(
        input: SignInInput
    ): Promise<UserMySqlEntity> {
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
}
