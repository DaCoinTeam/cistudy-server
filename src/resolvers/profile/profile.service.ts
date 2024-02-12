import { UserMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FindProfileByBearerTokenInput } from "./profile.input"
@Injectable()
export class ProfileService {
    constructor(
    @InjectRepository(UserMySqlEntity)
    private readonly userMySqlEntity: Repository<UserMySqlEntity>,
    ) {}

    async findProfileByBearerToken(
        input: FindProfileByBearerTokenInput,
    ): Promise<UserMySqlEntity> {
        return await this.userMySqlEntity.findOneBy(input)
    }
}
