import { UserMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FindProfileByAuthTokenInput } from "./profile.input"
@Injectable()
export class ProfileService {
    constructor(
    @InjectRepository(UserMySqlEntity)
    private readonly userMySqlEntity: Repository<UserMySqlEntity>,
    ) {}

    async findProfileByAuthToken(
        input: FindProfileByAuthTokenInput,
    ): Promise<UserMySqlEntity> {
        return await this.userMySqlEntity.findOneBy(input)
    }
}
