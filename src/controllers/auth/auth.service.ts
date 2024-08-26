import { randomPassword, SystemRoles } from "@common"
import { AccountMySqlEntity, RoleMySqlEntity } from "@database"
import { AuthManagerService, MailerService, Sha256Service } from "@global"
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import { ForgotPasswordInput, SignInInput, SignUpInput, VerifyRegistrationInput } from "./auth.input"
import { ForgotPasswordOutput, SignUpOutput, VerifyRegistrationOutput } from "./auth.output"

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(RoleMySqlEntity)
        private readonly roleMySqlRepository: Repository<RoleMySqlEntity>,
        private readonly sha256Service: Sha256Service,
        private readonly mailerService: MailerService,
        private readonly authManagerService: AuthManagerService,
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
        if (found.verified === false) {
            throw new UnauthorizedException("Your account is not verified, please check the confirmation email")
        }
        return found
    }

    async signUp(input: SignUpInput): Promise<SignUpOutput> {
        const { data } = input

        const foundAccount = await this.accountMySqlRepository.findOne({
            where: [
                { email: data.email },
                { username: data.username }
            ],
        })

        if (foundAccount) {
            if (foundAccount.email === data.email) {
                throw new ConflictException(`Account with email ${data.email} has existed.`)
            }
            if (foundAccount.username === data.username) {
                throw new ConflictException("Username already existed.")
            }
        }

        data.password = this.sha256Service.createHash(data.password)
        const created = await this.accountMySqlRepository.save(data)

        await this.mailerService.sendVerifyRegistrationMail(created.accountId, data.email, created.username)
        return {
            data: {
                message: "Your account has been created successfully, please check your email to confirm registration"
            }
        }
    }

    async verifyRegistration(input: VerifyRegistrationInput): Promise<VerifyRegistrationOutput> {

        const { data } = input
        const { token } = data

        const { accountId } = await this.authManagerService.verifyToken(token)

        const account = await this.accountMySqlRepository.findOne({
            where: {
                accountId
            },
        })

        if (!account) {
            throw new NotFoundException("Account not found")
        }

        if (account.verified) {
            throw new ConflictException("Account already verified")
        }

        await this.roleMySqlRepository.save({
            accountId,
            name: SystemRoles.User
        })

        await this.accountMySqlRepository.update(accountId, { verified: true })

        return {
            data: {
                message: "Account verified successfully!"
            }
        }
    }

    async forgotPassword(input: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
        const { data } = input
        const { email } = data

        const account = await this.accountMySqlRepository.findOne({
            where: {
                email
            }
        })

        if (!account || account.verified === false) {
            throw new ConflictException("Account not found or not been verified")
        }

        await this.mailerService.sendForgotPasswordMail(email, account.username, account.accountId)

        return {
            message: "Forgot password mail sent"
        }
    }

    async resetPassword(input: VerifyRegistrationInput): Promise<VerifyRegistrationOutput> {
        const { data } = input
        const { token } = data

        const { accountId } = await this.authManagerService.verifyToken(token)

        const account = await this.accountMySqlRepository.findOne({
            where: {
                accountId
            },
        })

        if (!account) {
            throw new NotFoundException("Account not found")
        }

        const newPassword = randomPassword()
        const changedPassword = this.sha256Service.createHash(newPassword)

        await this.accountMySqlRepository.update(accountId, { password: changedPassword })
        await this.mailerService.sendNewPasswordMail(account.email, account.username, newPassword)
        
        return {
            data: {
                message: "New password changed successfully"
            }
        }
    }

}