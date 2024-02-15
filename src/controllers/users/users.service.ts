import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { StorageService } from "@global"
import { UserEntity } from "src/database/mysql/user.entity"

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userMySqlRepository: Repository<UserEntity>,
        private readonly storageService: StorageService
    ) { }
}