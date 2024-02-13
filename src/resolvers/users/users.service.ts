import { UserMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FindOneUserInput } from "./users.input"
@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(UserMySqlEntity)
    private readonly userMySqlEntity: Repository<UserMySqlEntity>,
    ) {}

    async findOneUser(input: FindOneUserInput): Promise<UserMySqlEntity> {
        return await this.userMySqlEntity.findOneBy(input)
    }
}
