import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { AccountMySqlEntity, RoleMySqlEntity } from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import { MailerService, Sha256Service } from "@global"
import { SignInInput, SignUpInput, VerifyRegistrationInput } from "./auth.input"
import { SignUpOutput, VerifyRegistrationOutput } from "./auth.output"
import { JwtService } from "@nestjs/jwt"
import { jwtConfig } from "@config"
import { SystemRoles } from "@common"

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(RoleMySqlEntity)
        private readonly roleMySqlRepository: Repository<RoleMySqlEntity>,
        private readonly sha256Service: Sha256Service,
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService,
        private readonly dataSource: DataSource
    ) { }

    async signIn(input: SignInInput): Promise<AccountMySqlEntity> {
        const { data } = input
        const found = await this.accountMySqlRepository.findOneBy({
            email: data.email,
        })
        if (!found) throw new NotFoundException("Account not found.")

        if (!this.sha256Service.verifyHash(data.password, found.password))
            throw new UnauthorizedException("Invalid credentials.")
        if(found.verified === false){
            throw new UnauthorizedException("Your account is not verified, please check the confirmation email")
        }
        return found
    }

    async signUp(input: SignUpInput): Promise<SignUpOutput> {
        const { data } = input
        const found = await this.accountMySqlRepository.findOne({
            where: {
                email: data.email,
            },
        })
        if (found) {
            throw new ConflictException(
                `Account with email ${data.email} has existed.`,
            )
        }
        data.password = this.sha256Service.createHash(data.password)
        const created = await this.accountMySqlRepository.save(data)

        await this.mailerService.sendMail(created.accountId, data.email, created.username)
        return {
            message: "Your accoutn has been created successfully, please check your email to confirm registration"
        }
    }

    async verifyRegistration(input: VerifyRegistrationInput): Promise<VerifyRegistrationOutput> {

        const { accountId, data } = input
        const { token } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                ignoreExpiration: false,
                secret: jwtConfig().secret,
            });

            if (!decoded || !decoded.accountId || accountId !== decoded.accountId) {
                throw new NotFoundException('Invalid token');
            }

            const account = await this.accountMySqlRepository.findOne({
                where: {
                    accountId
                },
            });

            if (!account) {
                throw new NotFoundException('Account not found');
            }

            if (account.verified) {
                throw new ConflictException('Account already verified');
            }

            await this.roleMySqlRepository.save({
                accountId,
                name: SystemRoles.User
            })

            await this.accountMySqlRepository.update(accountId, {verified: true})
            await queryRunner.commitTransaction()

            return {
                message: "Account successfully verified"
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

}