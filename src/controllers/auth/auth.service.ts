import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { CartMySqlEntity, UserMySqlEntity } from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { MailerService, Sha256Service } from "@global"
import { SignInInput, SignUpInput } from "./auth.input"

@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(UserMySqlEntity)
    private readonly userMySqlRepository: Repository<UserMySqlEntity>,
    @InjectRepository(CartMySqlEntity)
    private readonly cartMySqlRepository: Repository<CartMySqlEntity>,
    private readonly sha256Service: Sha256Service,
    private readonly mailerService: MailerService,
    ) {}

    async signIn(input: SignInInput): Promise<UserMySqlEntity> {
        const { data } = input
        const found = await this.userMySqlRepository.findOneBy({
            email: data.email,
        })
        if (!found) throw new NotFoundException("User not found.")

        if (!this.sha256Service.verifyHash(data.password, found.password))
            throw new UnauthorizedException("Invalid credentials.")
        return found
    }

    async signUp(input: SignUpInput): Promise<string> {
        const { data } = input
  	const found = await this.userMySqlRepository.findOne({
  		where: {
  			email: data.email,
  		},
  	})
  	if (found) {
  		throw new ConflictException(
  			`User with email ${data.email} has existed.`,
  		)
  	}
  	data.password = this.sha256Service.createHash(data.password)
  	const created = await this.userMySqlRepository.save(data)
	//create cart here
  	await this.mailerService.sendMail(created.userId, data.email)
  	return `An user with id ${created.userId} has been created`
    }
}